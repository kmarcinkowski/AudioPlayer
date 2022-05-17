export default function Modal(props) {
    const { title, children, show, onSave, onClose } = props;
    return (
        show && (
            <>
                <div
                    className={`modal show d-block ${props.className ?? ""}`}
                    tabIndex="-1"
                    role="dialog"
                    data-bs-backdrop="static"
                    aria-modal={true}
                >
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={onClose}
                                >
                                    <span aria-hidden="true"></span>
                                </button>
                            </div>
                            <div className="modal-body">{children}</div>
                            <div className="modal-footer">
                                {onSave && (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={onSave}
                                    >
                                        {props.saveLabel ?? "Save"}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                    onClick={onClose}
                                >
                                    {props.closeLabel ?? "Cancel"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop show"></div>
            </>
        )
    );
}
