import React, { useState, useEffect } from 'react';
import trpc from '../../../services/trpc';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SearchComponentProps {
    disabled?: boolean;
    value?: string | null;
    onChange?: (email: string | null) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ disabled, value, onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');

    useEffect(() => {
        const delayTimer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 300);

        return () => { clearTimeout(delayTimer) };
    }, [searchTerm]);

    const { data: emails } = trpc.email.searchEmails.useQuery(
        debouncedTerm, { enabled: debouncedTerm.length >= 2 && !value }
    );

    const handleTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);
    };

    const handleEmailSelect = (event: React.MouseEvent<HTMLLIElement>) => {
        const email = event.currentTarget.innerText;
        onChange?.(email)
        setSearchTerm(email);
    };

    const handleClearSelectedEmail = () => {
        onChange?.(null)
        setSearchTerm('')
    }

    return (
        <div className="flex flex-col relative">
            <div className="flex join">
                <input
                    disabled={disabled}
                    type="text"
                    placeholder="To"
                    className="input input-bordered w-full max-w-xs join-item"
                    value={searchTerm}
                    onChange={handleTermChange}
                />
                {value && (
                    <button
                        disabled={disabled}
                        onClick={handleClearSelectedEmail}
                        className=" btn join-item bg-base-100 border border-base-300 hover:btn-error">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            {!disabled && (
                <ul className="bg-base-100 max-w-xs absolute bottom-0 translate-y-full
                border-neutral-700 border-1 shadow-sm rounded-sm overflow-clip w-full">
                    {emails?.map((result, index) => (
                        <li key={index} className="text-gray-800 px-4 py-1.5 text-md 
                        cursor-pointer hover:bg-base-300 max-w-xs " onClick={handleEmailSelect}>
                            {result}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchComponent;
