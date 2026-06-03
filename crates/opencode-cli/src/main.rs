#![forbid(unsafe_code)]

use opencode_core::current_baseline;
use std::io::{self, Write};
use std::process::ExitCode;

fn main() -> ExitCode {
    let stdout = io::stdout();
    let mut handle = stdout.lock();

    match run(&mut handle) {
        Ok(()) => ExitCode::SUCCESS,
        Err(_) => ExitCode::FAILURE,
    }
}

fn run(writer: &mut impl Write) -> io::Result<()> {
    let baseline = current_baseline();

    // The CLI deliberately exposes only reset metadata until the first real
    // vertical slice is chosen and documented.
    writeln!(
        writer,
        "{} status: {}",
        baseline.project_name(),
        baseline.status().as_str()
    )
}

#[cfg(test)]
mod tests {
    use super::run;

    #[test]
    fn run_prints_reset_baseline_status() {
        // Tests the CLI status output with an in-memory writer and asserts the
        // exact line because this is the only supported command behavior in the
        // reset baseline.
        let mut output = Vec::new();

        let result = run(&mut output);

        assert!(result.is_ok());
        assert_eq!(output, b"opencode-rs status: redesigning\n");
    }
}
