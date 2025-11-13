"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const branchLevels = [
  { id: 1, label: "Level 1", defaultAmount: 50000000 },
  { id: 2, label: "Level 2", defaultAmount: 40000000 },
  { id: 3, label: "Level 3", defaultAmount: 30000000 },
  { id: 4, label: "Level 4", defaultAmount: 20000000 },
];

// Define the Setting type for better typings
interface Setting {
  id: number | null;
  branchLevel: string;
  minAmount: number;
}

const CrmSettingPresentation = () => {
  const [settings, setSettings] = useState<Setting[]>([
    { id: 1, branchLevel: "Level 1", minAmount: 50000000 },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<Setting>({
    id: null,
    branchLevel: branchLevels[0].label,
    minAmount: branchLevels[0].defaultAmount,
  });

  const handleSave = () => {
    setSettings((prev) => {
      const existingIndex = prev.findIndex(
        (setting) => setting.branchLevel === currentSetting.branchLevel
      );

      if (existingIndex !== -1) {
        // Update existing setting
        const updatedSettings = [...prev];
        updatedSettings[existingIndex] = {
          ...updatedSettings[existingIndex],
          minAmount: currentSetting.minAmount,
        };
        return updatedSettings;
      }

      // Add new setting
      return [...prev, { ...currentSetting, id: Date.now() }];
    });

    resetForm();
  };

  // Explicitly type the parameter as Setting
  const handleEdit = (setting: Setting) => {
    setIsEditing(true);
    setCurrentSetting(setting);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentSetting({
      id: null,
      branchLevel: branchLevels[0].label,
      minAmount: branchLevels[0].defaultAmount,
    });
  };

  const handleBranchChange = (levelId: number) => {
    const branch = branchLevels.find((b) => b.id === levelId);
    if (branch) {
      setCurrentSetting((prev) => ({
        ...prev,
        branchLevel: branch.label,
        minAmount: branch.defaultAmount,
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Settings Table */}
      <div className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Assigned Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left whitespace-nowrap px-4 py-2">
                    Branch Level
                  </TableHead>
                  <TableHead className="text-left whitespace-nowrap px-4 py-2">
                    Minimum Amount (Birr)
                  </TableHead>
                  <TableHead className="text-left px-4 py-2">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting) => (
                  <TableRow key={setting.id ?? Date.now()}>
                    <TableCell className="px-4 py-2">
                      {setting.branchLevel}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {setting.minAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(setting)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <div className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Setting" : "Add New Setting"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Branch Level Selection */}
              <div>
                <Label htmlFor="branch-level">Branch Level</Label>
                <Select
                  value={branchLevels.find((b) => b.label === currentSetting.branchLevel)?.id.toString()}
                  onValueChange={(value) => handleBranchChange(Number(value))}
                >
                  <SelectTrigger id="branch-level" className="w-full">
                    <SelectValue placeholder="Select a branch level" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchLevels.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Minimum Amount Input */}
              <div>
                <Label htmlFor="min-amount">Minimum Amount (Birr)</Label>
                <Input
                  id="min-amount"
                  type="text" // text to allow formatting
                  value={currentSetting.minAmount.toLocaleString()}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^0-9]/g, "");
                    setCurrentSetting((prev) => ({
                      ...prev,
                      minAmount: Number(rawValue),
                    }));
                  }}
                  onBlur={(e) => {
                    const formattedValue = Number(e.target.value.replace(/[^0-9]/g, "")).toLocaleString();
                    e.target.value = formattedValue;
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="w-full">
              {isEditing ? "Update Setting" : "Save Setting"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CrmSettingPresentation;
