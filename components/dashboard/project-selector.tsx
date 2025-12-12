"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/types/database"
import { CreateProjectDialog } from "./create-project-dialog"

interface ProjectSelectorProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (projectId: string) => void
  onProjectCreated: () => void
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onSelectProject,
  onProjectCreated,
}: ProjectSelectorProps) {
  const [open, setOpen] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            {selectedProject ? selectedProject.name : "Selecione um projeto"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar projeto..." />
            <CommandList>
              <CommandEmpty>Nenhum projeto encontrado.</CommandEmpty>
              <CommandGroup>
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={() => {
                      onSelectProject(project.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedProjectId === project.id ? "opacity-100" : "opacity-0")}
                    />
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setShowCreateDialog(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar novo projeto
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          onProjectCreated()
          setShowCreateDialog(false)
        }}
      />
    </>
  )
}
