use std::{
    path::{Path, PathBuf},
    process::Command,
};

//mod audio;

use base64::Engine;
use reqwest::StatusCode;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
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
            open_movie_location,
            path_is_file,
            generate_object_preview,
            generate_animation_preview
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
    std::fs::write(Path::new(&project_path).join("main.py"), code).unwrap();
    println!("Recompiling project at {}", project_path);
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
        .arg(format!("{output_file_name}.{file_format}"))
        .arg("main.py")
        .current_dir(project_path)
        .spawn()
        .unwrap()
        .wait()
        .unwrap();
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
    std::fs::create_dir_all(Path::new(&path).join(&name).join("scripts"))
        .map_err(|_| "Error creating scripts directory".to_owned())?;

    std::fs::create_dir_all(Path::new(&path).join(&name).join("objects"))
        .map_err(|_| "Error creating objects directory".to_owned())?;

    // Return project location
    Ok(format!("{}", Path::new(&path).join(name).display()))
}

#[tauri::command]
async fn save_project_data(path: String, data: String) -> Result<(), String> {
    std::fs::write(Path::new(&path).join("project.manim"), data)
        .map_err(|_| "Error saving project".to_owned())?;
    Ok(())
}

#[tauri::command]
async fn generate_object_preview(path: &str, id: u32, code: &str) -> Result<String, String> {
    std::fs::create_dir_all(Path::new(&path).join("objects"))
        .map_err(|_| "Error creating objects directory".to_owned())?;
    let code_path = Path::new(&path)
        .join("objects")
        .join(format!("object_{id}.py"));
    std::fs::write(&code_path, code).map_err(|_| "Error writing object code".to_owned())?;

    let previews_dir = Path::new(&path).join("previews");
    std::fs::create_dir_all(&previews_dir)
        .map_err(|_| "Error creating objects directory".to_owned())?;
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
    std::fs::create_dir_all(Path::new(&path).join("animations"))
        .map_err(|_| "Error creating animations directory".to_owned())?;
    let code_path = Path::new(&path)
        .join("animations")
        .join(format!("animation_{id}.py"));
    std::fs::write(&code_path, code).map_err(|_| "Error writing animation code".to_owned())?;

    let previews_dir = Path::new(&path).join("previews");
    std::fs::create_dir_all(&previews_dir)
        .map_err(|_| "Error creating animations directory".to_owned())?;
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
    std::fs::read_to_string(Path::new(&path).join("project.manim"))
        .map_err(|_| "Error reading project".to_owned())
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

#[tauri::command]
fn open_movie_location(
    project_path: &str,
    low_res: bool,
    output_file_name: &str,
    file_format: &str,
    resolution_height: u32,
    fps: u32,
) {
    let video_path = Path::new(&project_path)
        .join("media")
        .join("videos")
        .join("main")
        .join(if low_res {
            "480p15".to_owned()
        } else {
            format!("{resolution_height}p{fps}")
        })
        .join(format!("{output_file_name}.{file_format}"));
    showfile::show_path_in_file_manager(video_path);
}
