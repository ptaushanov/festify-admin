export default function SignIn() {
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
                <div className="flex flex-col w-3/4 mt-8">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            type="text"
                            placeholder="example@example.com"
                            className="input input-bordered input-md focus:input-primary"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="****************"
                            className="input input-bordered input-md focus:input-primary"
                        />
                    </div>
                    <button className="btn btn-primary rounded-md mt-10 mb-12">
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    )
}