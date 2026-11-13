import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export type ContactStatus = "Active" | "Lead" | "Archived";
interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ContactStatus;
  lastContacted: string;
}

const ApiUrl = "http://localhost:3000/contacts";

export default function App() {
  const [contactsData, setContactsData] = useState<Contact[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [status, setStatus] = useState<ContactStatus>("Active");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [contactId, setContactId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const emptyValues = () => {
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setStatus("Active");
    setOpen(false);
    setIsUpdating(false);
    setIsDeleting(false);
  };
  useEffect(() => {
    let ignore = false;

    const getData = async (): Promise<void> => {
      try {
        const response: Response = await fetch(ApiUrl);
        if (!response.ok) throw new Error(`${response.status}`);
        const data: Contact[] = await response.json();
        if (!ignore) {
          setContactsData(data);
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
  }, [open, isDeleting]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let UpdatedUrl = ApiUrl;
    if (isUpdating) UpdatedUrl = `${ApiUrl}/${contactId}`;
    const newLead = {
      name,
      company,
      email,
      phone,
      status,
      lastContacted: format(new Date(), "yyyy-MM-dd"),
    };
    try {
      fetch(UpdatedUrl, {
        method: isUpdating ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLead),
      })
        .then((res) => res.json())
        .finally(() => emptyValues());
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id: string) => {
    setIsDeleting(true);
    try {
      fetch(`${ApiUrl}/${id}`, {
        method: "DELETE",
      }).finally(() => emptyValues());
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdate = (contact: Contact) => {
    setName(contact.name);
    setCompany(contact.company);
    setEmail(contact.email);
    setPhone(contact.phone);
    setStatus(contact.status);
    setContactId(contact.id);
    setIsUpdating(true);
    setOpen(true);
  };

  return (
    <main className="flex flex-col items-center justify-between py-24 sm:px-24 lg:px-32">
      <h1 className="text-3xl">Contact Directory</h1>
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-8 w-full">
        <Dialog open={open} onOpenChange={setOpen}>
          {/* Button that opens the pop-up */}
          <DialogTrigger asChild>
            <Button className="ml-auto cursor-pointer">Add Company</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-106.25">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Company Contact</DialogTitle>
                <DialogDescription>
                  Fill in the company and contact details below.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Company */}
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as ContactStatus)}
                    required
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select a Status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="cursor-pointer"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="cursor-pointer">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {
          <Table>
            <TableCaption>A list of your recent leads</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contacted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactsData.map((contact) => (
                <ContextMenu key={contact.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow className="cursor-pointer">
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.status}</TableCell>
                      <TableCell>{contact.lastContacted}</TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleUpdate(contact)}>
                      Update
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(contact.id)}
                    >
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </TableBody>
          </Table>
        }
      </div>
    </main>
  );
}
