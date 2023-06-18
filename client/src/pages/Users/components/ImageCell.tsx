function ImageCell({ data: { avatar } }: { data: { avatar?: string } }) {
    if (!avatar) return (
        <div>
            <p className="text-sm text-neutral-500">No avatar</p>
        </div>
    )

    return (
        <div className="avatar">
            <div className="w-12 rounded">
                <img src={avatar} alt={avatar} />
            </div>
        </div>
    )
}

export default ImageCell