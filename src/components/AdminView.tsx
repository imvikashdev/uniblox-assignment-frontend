// src/components/AdminView.tsx
import { useState, useEffect } from 'react';
import { apiGetAdminStats, apiGetActiveDiscount } from '@/lib/api';
import type { AdminStatsResponse, DiscountCodeResponse } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AdminView() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [activeDiscount, setActiveDiscount] =
    useState<DiscountCodeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statsData, activeDiscountData] = await Promise.all([
          apiGetAdminStats(),
          apiGetActiveDiscount(),
        ]);
        setStats(statsData);
        setActiveDiscount(activeDiscountData.activeDiscount);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load admin data.';
        setError(errorMessage);
        toast.error('Error loading admin data', { description: errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground p-4">
        Loading admin data...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 p-4">Error: {error}</p>;
  }

  if (!stats) {
    return (
      <p className="text-center text-muted-foreground p-4">
        No statistics available.
      </p>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg mt-6 bg-muted/40">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Admin Dashboard
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>Active Discount Code</CardTitle>
        </CardHeader>
        <CardContent>
          {activeDiscount ? (
            <Badge variant={'default'} className="text-lg font-mono p-2">
              {activeDiscount.code} (
              {parseFloat(activeDiscount.discountPercent).toFixed(0)}%)
            </Badge>
          ) : (
            <p className="text-muted-foreground">No active discount code.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Items Purchased</p>
            <p className="text-2xl font-bold">{stats.totalItemsPurchased}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">${stats.totalPurchaseAmount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Discount</p>
            <p className="text-2xl font-bold">${stats.totalDiscountAmount}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discount Code History</CardTitle>
          <CardDescription>
            List of all generated discount codes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Percent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Order Used In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.discountCodesGenerated.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No discount codes generated yet.
                  </TableCell>
                </TableRow>
              )}
              {stats.discountCodesGenerated.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono">{code.code}</TableCell>
                  <TableCell>
                    {parseFloat(code.discountPercent).toFixed(0)}%
                  </TableCell>
                  <TableCell>
                    {code.isActive && !code.isUsed && (
                      <Badge variant={'default'}>Active</Badge>
                    )}
                    {code.isUsed && <Badge variant="destructive">Used</Badge>}
                    {!code.isActive && !code.isUsed && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(code.createdAt)}</TableCell>
                  <TableCell>{code.orderUsedInId || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
