use std::{
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use base64::Engine;
use colored::Colorize;
use reqwest::StatusCode;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            recompile,
            load_video,
            load_file_base64_data,
            new_project,
            save_project_data,
            get_project_data,
            is_new_project_valid,
            path_exists,
            python_package_exists,
            get_fonts,
            command_exists,
            path_is_file,
            generate_object_preview,
            generate_animation_preview,
            compile,
            merge_audios
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn recompile(
    project_path: String,
    code: String,
    resolution_width: u32,
    resolution_height: u32,
    renderer: String,
    file_format: String,
    fps: u32,
    output_file_name: String,
) {
    let output_file = format!("{output_file_name}.{file_format}");
    std::fs::write(Path::new(&project_path).join("main.py"), code).unwrap();
    Command::new("manim")
        .arg("--resolution")
        .arg(format!("{resolution_width},{resolution_height}"))
        .arg("--renderer")
        .arg(renderer)
        .arg("--format")
        .arg(&file_format)
        .arg("--fps")
        .arg(format!("{fps}"))
        .arg("--output_file")
        .arg(output_file)
        .arg("main.py")
        .current_dir(project_path)
        .stdout(Stdio::null())
        .spawn()
        .unwrap()
        .wait()
        .unwrap();
}

#[tauri::command]
async fn compile(
    project_path: String,
    code: String,
    resolution_width: u32,
    resolution_height: u32,
    renderer: String,
    file_format: String,
    fps: u32,
    output_file_name: String,
    audios: Vec<Audio>,
    video_length: f32,
    open_when_finished: bool,
) {
    println!("\n{} project...", "Compiling".bold().green());

    println!("    {} Python...", "Running".bold().green());
    recompile(
        project_path.clone(),
        code,
        resolution_width,
        resolution_height,
        renderer,
        file_format.clone(),
        fps,
        output_file_name.clone(),
    )
    .await;

    let video_path = Path::new(&project_path)
        .join("media")
        .join("videos")
        .join("main")
        .join(format!("{resolution_height}p{fps}"))
        .join(format!("{output_file_name}.{file_format}"));

    let audio_path = Path::new(&project_path).join("cache").join("output").join("audio.mp3");

    println!("    {} Audios...", "Merging".bold().green());
    merge_audios(Path::new(&project_path).into(), audios, video_length, Some(audio_path.clone())).await;

    println!("    {} audio to video...", "Adding".bold().green());
    let output_path = Path::new(&project_path).join("output").join(format!("{output_file_name}.{file_format}"));
    add_audio_to_video(project_path.clone(), audio_path, &video_path, &output_path);

    if open_when_finished {
        println!("    {} movie location...", "Opening".bold().green());
        showfile::show_path_in_file_manager(&output_path);
        open::that(&output_path).unwrap();
    }

    println!("{}\n", "Done!".bold().green());
}

#[tauri::command]
async fn load_video(
    path: String,
    low_res: bool,
    output_file_name: &str,
    file_format: &str,
    resolution_height: u32,
    fps: u32,
) -> Result<String, String> {
    load_file_base64_data(
        Path::new(&path)
            .join("media")
            .join("videos")
            .join("main")
            .join(if low_res {
                "480p15".to_owned()
            } else {
                format!("{resolution_height}p{fps}")
            })
            .join(format!("{output_file_name}.{file_format}")),
    )
    .await
}

#[tauri::command]
async fn load_file_base64_data(path: PathBuf) -> Result<String, String> {
    let data = std::fs::read(path).map_err(|error| error.to_string())?;
    Ok(base64::engine::general_purpose::STANDARD.encode(&data))
}

#[tauri::command]
async fn new_project(path: String, name: String) -> Result<String, String> {
    // Create the project
    Command::new("uv")
        .arg("init")
        .arg(&name)
        .current_dir(&path)
        .spawn()
        .map_err(|_| "Error spawning UV".to_owned())?
        .wait()
        .map_err(|_| "Error Waiting for UV".to_owned())?;

    // Add Manim
    Command::new("uv")
        .arg("add")
        .arg("manim")
        .current_dir(Path::new(&path).join(&name))
        .spawn()
        .map_err(|_| "Error spawning UV".to_owned())?
        .wait()
        .map_err(|_| "Error Waiting for UV".to_owned())?;

    // Create scripts folder
    std::fs::create_dir_all(Path::new(&path).join(&name).join("scripts")).map_err(|_| "Error creating scripts directory".to_owned())?;

    std::fs::create_dir_all(Path::new(&path).join(&name).join("objects")).map_err(|_| "Error creating objects directory".to_owned())?;

    std::fs::create_dir_all(Path::new(&path).join(&name).join("cache").join("output")).map_err(|_| "Error creating cache directory".to_owned())?;

    std::fs::create_dir_all(Path::new(&path).join(&name).join("output")).map_err(|_| "Error creating cache directory".to_owned())?;

    std::fs::create_dir_all(Path::new(&path).join(&name).join("cache").join("audios").join("raw"))
        .map_err(|_| "Error creating cache directory".to_owned())?;
    std::fs::create_dir_all(Path::new(&path).join(&name).join("cache").join("audios").join("padded"))
        .map_err(|_| "Error creating cache directory".to_owned())?;

    // Return project location
    Ok(format!("{}", Path::new(&path).join(name).display()))
}

#[tauri::command]
async fn save_project_data(path: String, data: String) -> Result<(), String> {
    std::fs::write(Path::new(&path).join("project.manim"), data).map_err(|_| "Error saving project".to_owned())?;
    Ok(())
}

#[tauri::command]
async fn generate_object_preview(path: &str, id: u32, code: &str) -> Result<String, String> {
    std::fs::create_dir_all(Path::new(&path).join("objects")).map_err(|_| "Error creating objects directory".to_owned())?;
    let code_path = Path::new(&path).join("objects").join(format!("object_{id}.py"));
    std::fs::write(&code_path, code).map_err(|_| "Error writing object code".to_owned())?;

    let previews_dir = Path::new(&path).join("previews");
    std::fs::create_dir_all(&previews_dir).map_err(|_| "Error creating objects directory".to_owned())?;
    let preview_path = previews_dir.join(format!("object_{id}.png"));

    Command::new("manim")
        .arg("-o")
        .arg(&preview_path)
        .arg("-qh")
        .arg(&code_path)
        .current_dir(path)
        .spawn()
        .unwrap()
        .wait()
        .unwrap();

    load_file_base64_data(preview_path).await
}

#[tauri::command]
async fn generate_animation_preview(path: &str, id: u32, code: &str) -> Result<String, String> {
    std::fs::create_dir_all(Path::new(&path).join("animations")).map_err(|_| "Error creating animations directory".to_owned())?;
    let code_path = Path::new(&path).join("animations").join(format!("animation_{id}.py"));
    std::fs::write(&code_path, code).map_err(|_| "Error writing animation code".to_owned())?;

    let previews_dir = Path::new(&path).join("previews");
    std::fs::create_dir_all(&previews_dir).map_err(|_| "Error creating animations directory".to_owned())?;
    let preview_path = previews_dir.join(format!("animation_{id}.mp4"));

    Command::new("manim")
        .arg("-o")
        .arg(&preview_path)
        .arg("-qh")
        .arg(&code_path)
        .current_dir(path)
        .spawn()
        .unwrap()
        .wait()
        .unwrap();

    load_file_base64_data(preview_path).await
}

#[tauri::command]
fn get_project_data(path: String) -> Result<String, String> {
    std::fs::read_to_string(Path::new(&path).join("project.manim")).map_err(|_| "Error reading project".to_owned())
}

#[tauri::command]
fn is_new_project_valid(path: &str, name: &str) -> bool {
    let path = Path::new(path);

    if !path.is_dir() {
        return false;
    }

    if path.join(name).exists() {
        return false;
    }

    true
}

#[tauri::command]
fn path_exists(path: &str) -> bool {
    Path::new(path).exists()
}

#[tauri::command]
fn path_is_file(path: &str) -> bool {
    Path::new(path).is_file()
}

#[tauri::command]
fn command_exists(command: &str) -> bool {
    which::which(command).is_ok()
}

#[tauri::command]
async fn python_package_exists(package_name: String) -> Result<bool, String> {
    let url = format!("https://pypi.org/pypi/{package_name}/json");

    let Ok(resp) = reqwest::get(&url).await else {
        return Err("Error".to_owned());
    };

    match resp.status() {
        StatusCode::OK => Ok(true),
        StatusCode::NOT_FOUND => Ok(false),
        _ => Err("Error".to_owned()),
    }
}

#[tauri::command]
async fn get_fonts() -> Vec<String> {
    let mut fonts = font_enumeration::Collection::new()
        .unwrap()
        .all()
        .map(|font| font.family_name.clone())
        .collect::<Vec<String>>();
    fonts.sort();
    fonts.dedup();
    fonts
}

#[derive(serde::Deserialize)]
struct Audio {
    id: u32,
    data: String,
    start_time: f32,
    duration: f32,
}

#[tauri::command]
async fn merge_audios(project_path: PathBuf, audios: Vec<Audio>, video_length: f32, output_path: Option<PathBuf>) -> String {
    let output_path = output_path.unwrap_or_else(|| project_path.join("cache").join("output").join("audio.mp3"));
    let raw_audio_cache_path = project_path.join("cache").join("audios").join("raw");

    let padded_audio_cache_path = project_path.join("cache").join("audios").join("padded");

    let mut merge_command = Command::new("ffmpeg");
    merge_command.arg("-y");

    for audio in &audios {
        println!("        {} audio {}...", "Padding".bold().green(), audio.id);
        let audio_path = raw_audio_cache_path.join(format!("audio_{}.mp3", audio.id));
        let output_path = padded_audio_cache_path.join(format!("audio_{}.mp3", audio.id));

        std::fs::write(&audio_path, base64::engine::general_purpose::STANDARD.decode(&audio.data).unwrap()).unwrap();

        let mut file_path = audio_path;

        // Starting Silence
        if audio.start_time != 0. {
            println!("            {} start for audio {}...", "Padding".bold().green(), audio.id);
            add_start_silence(&project_path, audio.start_time, file_path, &output_path);
            file_path = output_path.clone();
        } else {
            println!("            {} start pad for audio {}...", "Skipping".bold().green(), audio.id);
        }

        // Ending Silence
        if audio.start_time + audio.duration < video_length {
            print!("            {} end for audio {}... ", "Padding".bold().green(), audio.id);
            add_end_silence(&project_path, video_length - audio.duration - audio.start_time, file_path, &output_path);
            file_path = output_path.clone();
        } else {
            println!("            {} end pad for audio {}...", "Skipping".bold().green(), audio.id);
        }

        // Trimming

        // Merging
        merge_command.arg("-i").arg(&file_path);
    }

    // Finish Merge
    println!("        {} padded audio clips...", "Merging".bold().green());
    merge_command
        .arg("-filter_complex")
        .arg(format!("amix=inputs={}:duration=first", audios.len()))
        .arg(&output_path)
        .current_dir(&project_path)
        .stdout(Stdio::null())
        .spawn()
        .unwrap()
        .wait()
        .unwrap();

    load_file_base64_data(output_path).await.unwrap()
}

fn add_audio_to_video<ProjectPath: AsRef<Path>, AudioPath: AsRef<Path>, VideoPath: AsRef<Path>, OutputPath: AsRef<Path>>(
    project_path: ProjectPath,
    audio_path: AudioPath,
    video_path: VideoPath,
    output_path: OutputPath,
) {
    Command::new("ffmpeg")
        .arg("-y")
        .arg("-i")
        .arg(video_path.as_ref())
        .arg("-i")
        .arg(audio_path.as_ref())
        .arg("-c")
        .arg("copy")
        .arg("-map")
        .arg("0:v:0")
        .arg("-map")
        .arg("1:a:0")
        .arg(output_path.as_ref())
        .current_dir(project_path)
        .stdout(Stdio::null())
        .spawn()
        .unwrap()
        .wait()
        .unwrap();
}

fn add_start_silence<ProjectPath: AsRef<Path>, InputPath: AsRef<Path>, OutputPath: AsRef<Path>>(
    project_path: ProjectPath,
    start_silence: f32,
    audio_file_path: InputPath,
    output_file_path: OutputPath,
) {
    Command::new("ffmpeg")
        .arg("-y")
        .arg("-i")
        .arg(audio_file_path.as_ref())
        .arg("-af")
        .arg(format!("adelay={start_silence}s:all=true"))
        .arg(output_file_path.as_ref())
        .current_dir(project_path)
        .stdout(Stdio::null())
        .spawn()
        .unwrap()
        .wait()
        .unwrap();
}

fn add_end_silence<ProjectPath: AsRef<Path>, InputPath: AsRef<Path>, OutputPath: AsRef<Path>>(
    project_path: ProjectPath,
    end_silence: f32,
    audio_file_path: InputPath,
    output_file_path: OutputPath,
) {
    let mut command = Command::new("ffmpeg");
    command
        .arg("-y")
        .arg("-i")
        .arg(audio_file_path.as_ref())
        .arg("-af")
        .arg(format!("apad=pad_dur={end_silence}"))
        .arg(output_file_path.as_ref())
        .current_dir(project_path)
        .stdout(Stdio::null());
    println!("{}", format!("({command:?})").dimmed());
    let status = command.status().unwrap();
}
