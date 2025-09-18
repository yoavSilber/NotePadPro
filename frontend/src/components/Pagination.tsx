import './Pagination.css';

export const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
}: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void; 
}) => {
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage < 3) {
            return [1, 2, 3, 4, 5];
        }

        if (currentPage > totalPages - 2) {
            return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
        }

        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    const pageNumbers = getPageNumbers();

    return (
         <div className="pagination">
            <button 
                name="first" 
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                First
            </button>
            <button 
                name="previous" 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    name={`page-${page}`}
                    onClick={() => onPageChange(page)}
                    disabled={currentPage === page}
                    style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
                >
                    {page}
                </button>
            ))}
            
            <button 
                name="next" 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
            <button 
                name="last" 
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                Last
            </button>
        </div>
    );
};