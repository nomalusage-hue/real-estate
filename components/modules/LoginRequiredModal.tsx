"use client";

import { useRouter } from "next/navigation";
import Portal from "../Portal/Portal";

interface LoginRequiredModalProps {
    open: boolean;
    onClose: () => void;
}

export default function LoginRequiredModal({
    open,
    onClose,
}: LoginRequiredModalProps) {
    const router = useRouter();

    if (!open) return null;

    return (
        <Portal>
            <div
                className="modal fade show d-block"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Login Required</h5>
                            <button className="btn-close" onClick={onClose}></button>
                        </div>

                        <div className="modal-body">
                            <p>You need to be logged in to save properties to your favorites.</p>
                            <p className="text-muted">Would you like to login now?</p>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={onClose}
                                style={{"padding": "12px 30px"}}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn custom-button"
                                onClick={() => {
                                    onClose();
                                    router.push("/login");
                                }}
                            >
                                Login Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
}