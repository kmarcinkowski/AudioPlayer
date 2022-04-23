import { memo, useEffect, useState } from 'react';

var DEFAULT_WIDTH = "100%";

function ProgressBar(props) {
    const [style] = useState({ width: props.width || DEFAULT_WIDTH });
    const [showProgress, setShowProgress] = useState(false);

    useEffect(() => {
        setShowProgress(props.show);
    }, [props.show])

    return (showProgress &&
        <div className='overlay'>
            <div className='progress-container'>
                <div className='progress'>
                    <div
                        className={`progress-bar progress-bar-striped progress-bar-animated ${props.className}`}
                        role="progressbar"
                        style={style}
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"></div>
                </div>
            </div>
        </div>
    )
}
export default memo(ProgressBar);