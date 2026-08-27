import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

/**
 * Presentation-only data table driven by a column config.
 * Parent pages own filtering, sorting and pagination state.
 *
 * columns: [{ key, header, className?, render?(row) }]
 */
export function DataTable({
  columns,
  rows,
  getRowId,
  isLoading = false,
  loadingRows = 5,
  emptyState,
}) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: loadingRows }).map((_, rowIndex) => (
              <TableRow key={`loading-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <Skeleton
                      className={cn("h-4", column.key === columns[0].key ? "w-28" : "w-16")}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                {emptyState ?? (
                  <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No results found.
                  </p>
                )}
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            rows.map((row) => (
              <TableRow key={getRowId(row)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
