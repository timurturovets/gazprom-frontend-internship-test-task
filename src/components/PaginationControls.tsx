import { Button } from '@consta/uikit/Button';
import { Select } from '@consta/uikit/Select';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (limit: number) => void;
}

const pageOptions = [10, 25, 50];

function PaginationControls({ page, totalPages, perPage, onPageChange, onPerPageChange }: PaginationControlsProps) {
  const pageCount = Math.max(1, totalPages);
  const visibleRange = 9;

  let startPage = Math.max(1, page - Math.floor(visibleRange / 2));
  let endPage = Math.min(pageCount, startPage + visibleRange - 1);

  if (endPage - startPage + 1 < visibleRange) {
    startPage = Math.max(1, endPage - visibleRange + 1);
  }

  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <div className="pagination-controls">
      <div className="pagination-buttons">
        <Button label="Предыдущая" size="m" view="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        {visiblePages.map((pageNumber) => (
          <Button
            key={pageNumber}
            label={String(pageNumber)}
            size="m"
            view={pageNumber === page ? 'primary' : 'ghost'}
            onClick={() => onPageChange(pageNumber)}
          />
        ))}
        <Button label="Следующая" size="m" view="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} />
      </div>
      <div className="pagination-select">
        <span>На странице:</span>
        <Select
          className="pagination-select-field"
          size="m"
          value={perPage}
          items={pageOptions}
          onChange={(value) => value !== null && onPerPageChange(value)}
          getItemKey={(item) => item}
          getItemLabel={(item) => String(item)}
        />
      </div>
    </div>
  );
}

export default PaginationControls;
