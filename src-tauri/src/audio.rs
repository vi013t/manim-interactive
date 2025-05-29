use ffmpeg_next as ffmpeg;
use std::fs::File;
use std::io::Write;
use std::process::Command;
use tempfile::NamedTempFile;

struct AudioSegment {
    start_time: f64,
    end_time: f64,
    base64_data: String,
}

fn save_base64_to_file(base64_data: &str, path: &str) -> anyhow::Result<()> {
    std::fs::write(path, base64::decode(base64_data)?)
}

fn do_work(segments: &[AudioSegment]) -> anyhow::Result<()> {
    ffmpeg::init().unwrap();

    let mut input_files = vec![];
    let mut filter_complex_parts = vec![];
    let mut inputs = vec![];

    for (i, seg) in segments.iter().enumerate() {
        let temp_file = NamedTempFile::new()?.into_temp_path();
        let path = temp_file.to_str().unwrap().to_string();
        save_base64_to_file(&seg.base64_data, &path)?;

        // Convert input to a WAV with silence padding
        let padded_path = format!("padded_{}.wav", i);
        let delay = seg.start_time * 1000.0; // milliseconds

        Command::new("ffmpeg")
            .args([
                "-y",
                "-i",
                &path,
                "-af",
                &format!("adelay={}|{}", delay, delay),
                &padded_path,
            ])
            .output()?;

        inputs.push(padded_path);
    }

    // Mix all files together
    let mut cmd = Command::new("ffmpeg");
    cmd.arg("-y");

    for input in &inputs {
        cmd.args(["-i", input]);
    }

    // Mix inputs
    cmd.args([
        "-filter_complex",
        &format!(
            "amix=inputs={}:duration=longest:dropout_transition=3",
            inputs.len()
        ),
        "output.wav",
    ]);

    let output = cmd.output()?;
    if !output.status.success() {
        eprintln!("FFmpeg error: {}", String::from_utf8_lossy(&output.stderr));
        return Err("FFmpeg mix failed".into());
    }

    println!("✅ Output saved to output.wav");

    Ok(())
}
