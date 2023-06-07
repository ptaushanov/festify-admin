function ImageCell({ data: { thumbnail } }: { data: { thumbnail: string } }) {
    return (
        <div className="avatar">
            <div className="w-12 rounded">
                <img src={thumbnail} alt={thumbnail} />
            </div>
        </div>
    )
}

export default ImageCell