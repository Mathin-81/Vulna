import { useNavigate } from 'react-router-dom';
import ScanProgress from '../components/ScanProgress';

const Scan = () => {
    const navigate = useNavigate();

    const handleScanComplete = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
            <ScanProgress onComplete={handleScanComplete} />
        </div>
    );
};

export default Scan;
