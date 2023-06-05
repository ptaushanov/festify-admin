import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/Auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Please provide a password")
});

type SignInType = z.infer<typeof signInSchema>;

export default function SignIn() {
    const { search } = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(search);
    const redirect = query.get("redirect");

    const { register, handleSubmit, formState: { errors } } = useForm<SignInType>({
        resolver: zodResolver(signInSchema),
    });

    const { signIn, isError, error } = useAuth();
    const onSubmit = async ({ email, password }: SignInType) => {
        const isSignedIn = await signIn(email, password)
        if (isSignedIn) navigate(redirect || "/")
    };

    return (
        <div className="bg-base-200 flex-1 flex justify-center items-center -mt-10">
            <div className="card bg-base-100 w-[30rem] rounded-lg shadow-sm flex flex-col items-center">
                <h1 className="text-lg font-bold mt-10 uppercase">
                    Festify Admin
                </h1>

                <h2 className="mt-10 text-2xl font-bold text-primary">
                    Hi, Welcome Back
                </h2>

                <p className="text-base-content mt-5 font-semibold">
                    Enter your credentials to continue
                </p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col w-3/4 mt-8"
                >
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            type="text"
                            placeholder="example@example.com"
                            className="input input-bordered input-md focus:input-primary"
                            {...register("email")}
                        />
                        <label className="label">
                            <span className="label-text-alt text-error font-semibold">
                                {errors.email?.message}
                            </span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="****************"
                            className="input input-bordered input-md focus:input-primary"
                            {...register("password")}
                        />
                        <label className="label">
                            <span className="label-text-alt text-error font-semibold">
                                {errors.password?.message}
                            </span>
                        </label>
                    </div>
                    <div className="flex-1 flex flex-col mt-6">
                        {isError && (
                            <span className="label-text-alt text-error font-semibold text-center">
                                {error}
                            </span>
                        )}
                        <button type="submit" className="btn mt-4 btn-primary rounded-md mb-12">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}