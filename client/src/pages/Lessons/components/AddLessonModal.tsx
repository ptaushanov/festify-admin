import { RefObject } from 'react'
import trpc from '../../../services/trpc';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface AddLessonModalProps {
    modalRef: RefObject<HTMLDialogElement>
    season: "spring" | "summer" | "autumn" | "winter";
}

const createLessonSchema = z.object({
    celebrated_on: z.string()
        .nonempty(),
    holiday_name: z.string()
        .nonempty(),
    xp_reward: z.number()
        .int()
        .min(0)
        .max(1000),
    last_for_season: z.boolean(),
    thumbnail: z.string()
        .nonempty(),
});

type LessonCreationType = z.infer<typeof createLessonSchema>;

function AddLessonModal({ modalRef, season }: AddLessonModalProps) {
    const allowedExtensions = ["jpg", "jpeg", "png"]

    const lessonMutation = trpc.lesson.createLesson.useMutation()
    const trpcContext = trpc.useContext()

    const {
        register, reset, setValue, watch,
        handleSubmit,
        formState: { errors }
    } = useForm<LessonCreationType>({
        resolver: zodResolver(createLessonSchema),
    });


    const handleModalClose = () => {
        reset()
        modalRef.current?.close()
    }

    const thumbnail = watch("thumbnail")
    const onSubmit = async (lesson: LessonCreationType) => {
        lessonMutation.mutate({ season, lesson }, {
            onSuccess: () => {
                modalRef.current?.close()
                trpcContext.lesson.getLessonsBySeason.invalidate({ season })
            }
        })
    };

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const thumbnail = event.target.files?.[0]
        if (!thumbnail) return

        const fileReader = new FileReader()
        fileReader.readAsDataURL(thumbnail)
        fileReader.addEventListener('load', () => {
            const result = fileReader.result
            if (typeof result === 'string' && result.startsWith('data:image')) {
                setValue("thumbnail", result)
            }
        });
    }

    return (
        <dialog className="modal" ref={modalRef}>
            <form className="modal-box max-w-4xl w-auto" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-stretch space-x-2 pt-4 px-4">
                    <div className="flex flex-col flex-1">
                        <h3 className="font-bold text-xl">
                            Create a new lesson
                        </h3>
                        <div className="mt-3">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Celebrated on
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("celebrated_on")}
                                />
                                <label className={`label ${!errors.celebrated_on ? 'hidden' : ''}`}>
                                    <span className="label-text-alt text-error font-semibold">
                                        {errors.celebrated_on?.message}
                                    </span>
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Holiday name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("holiday_name")}
                                />
                                <label className={`label ${!errors.holiday_name ? 'hidden' : ''}`}>
                                    <span className="label-text-alt text-error font-semibold">
                                        {errors.holiday_name?.message}
                                    </span>
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Xp reward
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={1000}
                                    className="input input-bordered w-full"
                                    {...register("xp_reward", { valueAsNumber: true })}
                                />
                                <label className={`label ${!errors.xp_reward ? 'hidden' : ''}`}>
                                    <span className="label-text-alt text-error font-semibold">
                                        {errors.xp_reward?.message}
                                    </span>
                                </label>
                            </div>
                            <div className="form-control w-full my-2">
                                <label className="label cursor-pointer flex items-center">
                                    <span className="label-text font-semibold">
                                        Last for the season
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="toggle"
                                        {...register("last_for_season")}
                                    />
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Thumbnail
                                    </span>
                                    <span className="label-text-alt">
                                        {allowedExtensions.join(", ")}
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    accept={allowedExtensions.join(", ")}
                                    onChange={handleThumbnailChange}
                                    className="file-input file-input-bordered w-full"
                                />
                                <label className={`label ${!errors.thumbnail ? 'hidden' : ''}`}>
                                    <span className="label-text-alt text-error font-semibold">
                                        {errors.thumbnail?.message}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {!!thumbnail && <>
                        <div className="divider divider-horizontal"></div>
                        <div className="flex flex-1 justify-center">
                            <div className="avatar w-full">
                                <div className="w-full rounded-md">
                                    <img src={thumbnail} />
                                </div>
                            </div>
                        </div>
                    </>}
                </div>
                <div className="modal-action">
                    <button className="btn btn-neutral" type="submit">
                        Create
                    </button>
                    <button className="btn" type="button" onClick={handleModalClose}>
                        Close
                    </button>
                </div>
            </form>
        </dialog>
    )
}

export default AddLessonModal
