import { VisitsTable } from "./visits-table";

export default function LogPage() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Activity Log</h1>
          <p className="text-muted-foreground">
            Recent AI crawler activities on your website
          </p>
        </div>
      </div>

      <VisitsTable />
    </div>
  );
}
