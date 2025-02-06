import { ActionPanel, List, Action, showToast, Toast } from "@raycast/api";
import fs from "fs";
import path from "path";
import os from "os";

const workspaceDir: string = path.join(os.homedir(), "www");

interface Workspace {
  title: string;
  path: string;
}

const getVSCodeWorkspaces = (): Workspace[] => {
  try {
    const files: string[] = fs.readdirSync(workspaceDir);
    return files
      .filter((file) => file.endsWith(".code-workspace")) // Filter out only VS Code workspace files
      .map(
        (file: string): Workspace => ({
          title: file.split(".")[0],
          path: path.join(workspaceDir, file),
        }),
      );
  } catch (error) {
    showToast({ style: Toast.Style.Failure, title: "Error loading workspaces" });
    console.error("Error reading workspace directory:", error);
    return [];
  }
};

export default function Command() {
  const workspaces = getVSCodeWorkspaces();

  return (
    <List searchBarPlaceholder="Search workspaces...">
      {workspaces.map((workspace) => (
        <List.Item
          key={workspace.path}
          title={workspace.title}
          accessories={[{ text: workspace.path }]}
          icon={{ source: "extension-icon.png" }}
          actions={
            <ActionPanel>
              <Action.Open title="Open in VS Code" target={workspace.path} application="Visual Studio Code" />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
