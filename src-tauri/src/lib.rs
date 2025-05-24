use std::{path::Path, process::Command};

use base64::Engine;

#[tauri::command]
fn recompile(project_path: &str, code: &str) {
    println!("Saving...");
    std::fs::write(Path::new(project_path).join("main.py"), code).unwrap();
    Command::new("manim")
        .arg("-ql")
        .arg("main.py")
        .current_dir(project_path)
        .spawn()
        .unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![recompile, load_video])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn load_video(path: String) -> Result<String, String> {
    let file_path = std::path::PathBuf::from(path);
    match std::fs::read(&file_path) {
        Ok(contents) => {
            let encoded = base64::engine::general_purpose::STANDARD.encode(contents);
            Ok(format!("data:video/mp4;base64,{}", encoded))
        }
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}
