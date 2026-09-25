# Source Acquisition Skill

## Goal
Produce a verified local source MP4 without coupling acquisition to editing.

## Inputs
- source URL
- output path

## Required behavior
1. Validate URL.
2. Select an acquisition method that is known to work in the current execution environment.
3. Download to a temporary file.
4. Verify non-zero size and ffprobe metadata.
5. Atomically promote the verified file to the source path.

## Failure behavior
Return a clear acquisition failure with evidence. Do not fabricate a source or continue into editing with a missing file.

## Important
The current production workflow accepts stable HTTP(S) MP4 URLs. YouTube direct acquisition is a separate unresolved capability and must not be represented as solved.
