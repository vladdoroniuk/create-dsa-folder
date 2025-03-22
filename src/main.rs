use std::io::Result;
use std::fs::File;
use std::path::Path;
use clap::Parser;

#[derive(Parser)]
struct Cli {
    dsa_name: String,
    #[arg(short, long, default_value_t = String::from("src"))]
    src: String
}

fn dsa_init(dsa_name: &str, src: &str) -> Result<()> {
    let dsa_dir = Path::new(src);
    std::fs::create_dir_all(&dsa_dir)?;
    std::env::set_current_dir(&dsa_dir)?;
    std::fs::create_dir(&dsa_name)?;
    std::env::set_current_dir(&dsa_name)?;

    let dsa_ts = format!("{}.go", &dsa_name).to_string();
    File::create(dsa_ts)?;

    let dsa_test_ts = format!("{}_test.go", &dsa_name).to_string();
    File::create(&dsa_test_ts)?;

    let dsa_readme = String::from("README.md");
    File::create(&dsa_readme)?;

    Ok(())
}

fn main() {
    let args = Cli::parse();
    dsa_init(&args.dsa_name, &args.src).unwrap();
}
