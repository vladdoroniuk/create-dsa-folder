use std::io::Result;
use std::fs::File;
use clap::Parser;

#[derive(Parser)]
struct Cli {
    dsa_name: String,
}

fn dsa_init(dsa_name: &str) -> Result<()> {
    std::fs::create_dir(dsa_name)?;
    std::env::set_current_dir(dsa_name)?;

    let dsa_ts = format!("{}.ts", dsa_name).to_string();
    File::create(dsa_ts)?;

    let dsa_test_ts = format!("{}.test.ts", dsa_name).to_string();
    File::create(dsa_test_ts)?;

    let dsa_readme = String::from("README.md");
    File::create(dsa_readme)?;

    Ok(())
}

fn main() {
    let args = Cli::parse();
    dsa_init(&args.dsa_name).unwrap();
}
