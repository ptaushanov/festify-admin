import { RefObject } from 'react'
import trpc from '../../../services/trpc';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface AddAdminModalProps {
    modalRef: RefObject<HTMLDialogElement>
}

const createAdminSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6).max(50),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

type AdminCreationType = z.infer<typeof createAdminSchema>;

function AddAdminModal({ modalRef }: AddAdminModalProps) {
    const adminMutation = trpc.admin.createAdmin.useMutation()
    const trpcContext = trpc.useContext()

    const {
        register, reset, handleSubmit, formState: { errors }
    } = useForm<AdminCreationType>({
        resolver: zodResolver(createAdminSchema),
    });


    const handleModalClose = () => {
        reset()
        modalRef.current?.close()
    }

    const onSubmit = async (adminData: AdminCreationType) => {
        adminMutation.mutate(adminData, {
            onSuccess: () => {
                handleModalClose()
                trpcContext.admin.getAllAdmins.invalidate()
            },
            onError: (error) => {
                console.log(error)
            }
        })
    };

    const { isError, error } = adminMutation

    return (
        <dialog className="modal" ref={modalRef}>
            <form className="modal-box max-w-md " onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-stretch space-x-2 pt-4 px-4">
                    <div className="flex flex-col flex-1">
                        <h3 className="font-bold text-xl">
                            New administrator
                        </h3>
                        <div className="mt-3">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Username
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("username")}
                                />
                                <label className={`label ${!errors.username ? 'hidden' : ''}`}>
                                    <span className="label-text-alt text-error font-semibold">
                                        {errors.username?.message}
                                    </span>
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Email
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("email")}
                                />
                                <label className={`label ${!errors.email ? 'hidden' : ''}`}>
                                    <span className="label-text-alt text-error font-semibold">
                                        {errors.email?.message}
                                    </span>
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    {...register("password")}
                                />
                                <label className={`label ${!errors.password ? 'hidden' : ''}`}>
                                    <span className="label-text-alt text-error font-semibold">
                                        {errors.password?.message}
                                    </span>
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Confirm password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    {...register("confirmPassword")}
                                />
                                <label className={`label ${!errors.confirmPassword ? 'hidden' : ''}`}>
                                    <span className="label-text-alt text-error font-semibold">
                                        {errors.confirmPassword?.message}
                                    </span>
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className={`label ${!isError ? 'hidden' : ''}`}>
                                    <span className="label-text-alt text-error font-semibold">
                                        {error?.message}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <button className="btn btn-neutral" type="submit">
                        Add
                    </button>
                    <button className="btn" type="button" onClick={handleModalClose}>
                        Close
                    </button>
                </div>
            </form>
        </dialog>
    )
}

export default AddAdminModal
