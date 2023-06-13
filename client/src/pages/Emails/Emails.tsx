import { useState } from "react";
import SearchComponent from "./components/SearchComponent";
import trpc from "../../services/trpc";
import { toast } from "react-hot-toast";

export default function Emails() {
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const [emailAll, setEmailAll] = useState<boolean>(false);
    const [subject, setSubject] = useState<string>("");
    const [body, setBody] = useState<string>("");

    const emailMutation = trpc.email.sendEmail.useMutation();

    const handleSendEmail = () => {
        const to = emailAll ? "all" : selectedEmail;
        if (!to) return;
        emailMutation.mutate({ to, subject, body }, {
            onSuccess: () => {
                setSubject("");
                setBody("");
                toast.success("Email sent!");
            }
        });
    }

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
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </div>
            <div className="mt-6 flex-1 bg-base-300 p-6 rounded-md">
                <textarea
                    className="textarea textarea-bordered w-full h-full"
                    placeholder="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                ></textarea>
            </div>
            <button
                onClick={handleSendEmail}
                className="btn mt-4 bg-neutral text-neutral-content self-end"
            >
                Send
            </button>
        </div>
    )
}