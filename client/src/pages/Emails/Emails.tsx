import { useState } from "react";
import SearchComponent from "./components/SearchComponent";

export default function Emails() {
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const [emailAll, setEmailAll] = useState<boolean>(false);

    return (
        <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-bold">
                Emails
            </h1>
            <div className="flex flex-col mt-10 space-y-2 bg-base-300 p-6 rounded-md">
                <div className="flex flex-row space-x-4">
                    <SearchComponent
                        value={selectedEmail}
                        onChange={setSelectedEmail}
                        disabled={emailAll}
                    />
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text mr-2 font-semibold">
                                Email all users
                            </span>
                            <input
                                type="checkbox"
                                checked={emailAll}
                                onChange={() => setEmailAll(!emailAll)}
                                className="checkbox"
                            />
                        </label>
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Subject"
                    className="input input-bordered w-full"
                />
            </div>
            <div className="mt-6 flex-1 bg-base-300 p-6 rounded-md">
                <textarea
                    className="textarea textarea-bordered w-full h-full"
                    placeholder="Body"
                ></textarea>
            </div>
            <button className="btn mt-4 bg-neutral text-neutral-content self-end">
                Send
            </button>
        </div>
    )
}