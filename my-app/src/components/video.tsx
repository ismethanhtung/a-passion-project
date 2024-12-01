export function Video(link: string) {
    return (
        <video width="320" height="240" controls preload="none">
            <source src="/path/to/video.mp4" type="video/mp4" />
            <track src={link} kind="subtitles" srcLang="en" label="English" />
        </video>
    );
}
