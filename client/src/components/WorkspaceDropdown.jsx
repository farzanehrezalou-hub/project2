import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useClerk, useOrganizationList } from "@clerk/react";

import { setCurrentWorkspace } from "../features/workspaceSlice";


function WorkspaceDropdown() {
    const { setActive, userMemberships, isLoaded } = useOrganizationList({
        userMemberships: true,
    });

    const { openCreateOrganization } = useClerk();

    const { workspaces, currentWorkspace } = useSelector(
        (state) => state.workspace
    );

    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const onSelectWorkspace = (organizationId) => {
        setActive({
            organization: organizationId,
        });

        dispatch(setCurrentWorkspace(organizationId));

        setIsOpen(false);

        navigate("/");
    };


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);


    // Set active organization
    useEffect(() => {
        if (currentWorkspace && isLoaded) {
            setActive({
                organization: currentWorkspace.id,
            });
        }
    }, [currentWorkspace, isLoaded]);


    return (
        <div 
            className="relative m-4" 
            ref={dropdownRef}
        >

            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-3 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
            >

                <div className="flex items-center gap-3">

                    <img
                        src={currentWorkspace?.image_url}
                        alt={currentWorkspace?.name}
                        className="w-8 h-8 rounded shadow"
                    />

                    <div className="min-w-0 flex-1">

                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {currentWorkspace?.name || "Select Workspace"}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                            {workspaces.length} workspace
                            {workspaces.length !== 1 && "s"}
                        </p>

                    </div>

                </div>


                <ChevronDown className="w-4 h-4 text-gray-500" />

            </button>



            {isOpen && (

                <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border rounded shadow-lg top-full left-0">

                    <div className="p-2">

                        <p className="text-xs text-gray-500 uppercase mb-2 px-2">
                            Workspaces
                        </p>


                        {userMemberships?.data?.map((membership) => {

                            const organization = membership.organization;

                            return (

                                <div
                                    key={organization.id}
                                    onClick={() =>
                                        onSelectWorkspace(organization.id)
                                    }
                                    className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
                                >

                                    <img
                                        src={organization.imageUrl}
                                        alt={organization.name}
                                        className="w-6 h-6 rounded"
                                    />


                                    <div className="flex-1 min-w-0">

                                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {organization.name}
                                        </p>


                                        <p className="text-xs text-gray-500">
                                            {organization.membersCount || 0} members
                                        </p>

                                    </div>


                                    {currentWorkspace?.id === organization.id && (
                                        <Check className="w-4 h-4 text-blue-600" />
                                    )}

                                </div>

                            );
                        })}


                    </div>


                    <hr className="border-gray-200 dark:border-zinc-700" />


                    <div
                        onClick={() => {
                            openCreateOrganization();
                            setIsOpen(false);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >

                        <p className="flex items-center gap-2 text-xs text-blue-600">
                            <Plus className="w-4 h-4" />
                            Create Workspace
                        </p>

                    </div>


                </div>

            )}

        </div>
    );
}


export default WorkspaceDropdown;