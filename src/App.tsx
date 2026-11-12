import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { TableCell, TableRow } from "./components/ui/table";

type Items = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

interface InvoiceData {
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  issuer: {
    name: string;
    email: string;
    address: string;
  };
  client: {
    name: string;
    email: string;
    address: string;
  };
  items: Items[];
  subtotal: number;
  taxRate: number;
  discount: number;
  grandTotal: number;
  notes: string;
}

export default function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);

  useEffect(() => {
    let ignore = false;

    const getData = async (): Promise<void> => {
      try {
        const response: Response = await fetch(
          "http://localhost:3000/invoices",
        );
        if (!response.ok) throw new Error(`${response.status}`);
        const data: InvoiceData[] = await response.json();
        console.log(data);
        if (!ignore) {
          setInvoiceData(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
        }
      }
    };

    getData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          InvoicePulse Dashboard
        </h1>
        <Button>+ New Invoice</Button>
      </div>

      {/* Metric Card Example */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,500.00</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        {invoiceData &&
          invoiceData[0]?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                ${item.total.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
      </div>
    </main>
  );
}
