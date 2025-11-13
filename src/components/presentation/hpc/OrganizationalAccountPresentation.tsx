import React, { FC, useState } from "react";
import { Plus, X, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormMember {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface OrganizationPresentationProps {
  onSubmit: (companyName: string, members: FormMember[]) => Promise<void>;
  isLoading?: boolean;
}

const OrganizationPresentation: FC<OrganizationPresentationProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [members, setMembers] = useState<FormMember[]>([
    { fullName: "", email: "", phoneNumber: "" },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !companyName.trim() ||
      members.some(
        (m) =>
          !m.fullName.trim() || !m.email.trim() || !m.phoneNumber.trim()
      )
    ) {
      alert("Please fill all required fields");
      return;
    }

    await onSubmit(companyName.trim(), members);
  };

  const addMember = () => {
    setMembers([...members, { fullName: "", email: "", phoneNumber: "" }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (
    index: number,
    field: keyof FormMember,
    value: string
  ) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  return (
    <Card className="max-w-4xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>Create Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Company Name *</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <Label>Members *</Label>
              <div className="space-y-3 mt-2">
                {members.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <Input
                          placeholder="Full name *"
                          value={member.fullName}
                          onChange={(e) =>
                            updateMember(index, "fullName", e.target.value)
                          }
                          required
                        />
                        <Input
                          placeholder="Email *"
                          type="email"
                          value={member.email}
                          onChange={(e) =>
                            updateMember(index, "email", e.target.value)
                          }
                          required
                        />
                        <Input
                          placeholder="Phone *"
                          value={member.phoneNumber}
                          onChange={(e) =>
                            updateMember(index, "phoneNumber", e.target.value)
                          }
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMember(index)}
                        disabled={members.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addMember}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="gap-2">
              <Send className="h-4 w-4" />
              {isLoading ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrganizationPresentation;
