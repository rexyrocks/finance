import { Topbar } from '@/components/layout/topbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="flex-1">
      <Topbar title="Settings" subtitle="Data, access, and export preferences" />

      <div className="space-y-5 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Export and backup</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <a href="/api/export/csv?type=assets"><Button variant="secondary">Export assets CSV</Button></a>
            <a href="/api/export/csv?type=liabilities"><Button variant="secondary">Export liabilities CSV</Button></a>
            <a href="/api/export/csv?type=insurance"><Button variant="secondary">Export insurance CSV</Button></a>
            <a href="/api/export/pdf"><Button variant="primary">Download PDF summary</Button></a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role-based access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink-200">
              The schema supports <code className="text-ink-0">OWNER</code>, <code className="text-ink-0">EDITOR</code>, and{' '}
              <code className="text-ink-0">VIEWER</code> roles on every <code className="text-ink-0">User</code>. Gate write routes
              (POST/PATCH/DELETE under <code className="text-ink-0">/api</code>) by checking the session role from{' '}
              <code className="text-ink-0">getServerSession(authOptions)</code> before mutating data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit log</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink-200">
              Every create, update, and delete writes an <code className="text-ink-0">AuditLog</code> row with a diff. Build a table
              page reading <code className="text-ink-0">prisma.auditLog.findMany</code> ordered by <code className="text-ink-0">createdAt desc</code> to surface it in the UI.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
