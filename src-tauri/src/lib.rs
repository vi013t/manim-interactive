use std::{path::Path, process::Command};

use base64::Engine;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            recompile,
            load_video,
            load_audio,
            new_project,
            save_project_data,
            get_project_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn recompile(project_path: &str, code: &str, low_res: bool) {
    std::fs::write(Path::new(project_path).join("main.py"), code).unwrap();
    Command::new("manim")
        .arg(if low_res { "-ql" } else { "-qh" })
        .arg("main.py")
        .current_dir(project_path)
        .spawn()
        .unwrap()
        .wait()
        .unwrap();
}

#[tauri::command]
fn load_video(path: String, low_res: bool) -> Result<String, String> {
    let video_path = Path::new(&path)
        .join("media")
        .join("videos")
        .join("main")
        .join(if low_res { "480p15" } else { "1080p60" })
        .join("Main.mp4");
    match std::fs::read(&video_path) {
        Ok(contents) => {
            let encoded = base64::engine::general_purpose::STANDARD.encode(contents);
            Ok(format!("data:video/mp4;base64,{}", encoded))
        }
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}

#[tauri::command]
fn load_audio(path: String) -> Result<String, String> {
    let data = std::fs::read(path).map_err(|error| error.to_string())?;
    Ok(base64::engine::general_purpose::STANDARD.encode(&data))
}

#[tauri::command]
fn new_project(path: String, name: String) -> Result<String, String> {
    let path = Path::new(&path).join(&name);
    std::fs::create_dir_all(&path).map_err(|_| "Error creating directory".to_owned())?;
    std::fs::write(path.join("main.py"), "").map_err(|_| "Error creating script".to_owned())?;
    Ok(format!("{}", path.display()))
}

#[tauri::command]
fn save_project_data(path: String, data: String) -> Result<(), String> {
    std::fs::write(Path::new(&path).join("project.manim"), data)
        .map_err(|_| "Error saving project".to_owned())?;
    Ok(())
}

#[tauri::command]
fn get_project_data(path: String) -> Result<String, String> {
    std::fs::read_to_string(Path::new(&path).join("project.manim"))
        .map_err(|_| "Error reading project".to_owned())
}
