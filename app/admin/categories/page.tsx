"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Plus, GripVertical, Edit, Trash2, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: "everything", name: "Everything", count: 6, isDefault: true },
    { id: "tablet", name: "Tablet", count: 2, isDefault: false },
    { id: "laptops", name: "Laptops", count: 1, isDefault: false },
    { id: "keyboard", name: "Keyboard", count: 1, isDefault: false },
    { id: "mousepad", name: "Mousepad", count: 1, isDefault: false },
    { id: "guide", name: "Guide", count: 1, isDefault: false },
  ])

  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [editName, setEditName] = useState("")

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(categories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCategories(items)
    toast({
      title: "Categories reordered",
      description: "The display order has been updated",
    })
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a name for the category",
        variant: "destructive",
      })
      return
    }

    // Create slug-like ID from name
    const id = newCategory.toLowerCase().replace(/\s+/g, "-")

    // Check if category with this ID already exists
    if (categories.some((cat) => cat.id === id)) {
      toast({
        title: "Category already exists",
        description: "A category with this name already exists",
        variant: "destructive",
      })
      return
    }

    const newCategoryObj = {
      id,
      name: newCategory,
      count: 0,
      isDefault: false,
    }

    setCategories([...categories, newCategoryObj])
    setNewCategory("")

    toast({
      title: "Category added",
      description: `"${newCategory}" has been added to your categories`,
    })
  }

  const handleEditClick = (category) => {
    setEditingCategory(category.id)
    setEditName(category.name)
  }

  const handleSaveEdit = (id) => {
    if (!editName.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a name for the category",
        variant: "destructive",
      })
      return
    }

    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, name: editName } : cat)))

    setEditingCategory(null)
    setEditName("")

    toast({
      title: "Category updated",
      description: "The category name has been updated",
    })
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setEditName("")
  }

  const handleDeleteCategory = (id, name) => {
    // Don't allow deleting the default "Everything" category
    if (id === "everything") {
      toast({
        title: "Cannot delete default category",
        description: "The 'Everything' category cannot be deleted",
        variant: "destructive",
      })
      return
    }

    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      setCategories(categories.filter((cat) => cat.id !== id))

      toast({
        title: "Category deleted",
        description: `"${name}" has been deleted`,
      })
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Category Management</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
            <CardDescription>Create a new category to organize your products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCategory} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" /> Add Category
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
            <CardDescription>
              Drag and drop to reorder categories. The order here will be reflected in your shop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {categories.map((category, index) => (
                      <Draggable
                        key={category.id}
                        draggableId={category.id}
                        index={index}
                        isDragDisabled={editingCategory === category.id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between p-3 bg-white border rounded-md"
                          >
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps} className="cursor-move">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>

                              {editingCategory === category.id ? (
                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-48"
                                  autoFocus
                                />
                              ) : (
                                <span className="font-medium">{category.name}</span>
                              )}

                              {category.isDefault && (
                                <Badge variant="outline" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="mr-2">
                                {category.count} products
                              </Badge>

                              {editingCategory === category.id ? (
                                <>
                                  <Button variant="ghost" size="sm" onClick={() => handleSaveEdit(category.id)}>
                                    <Save className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(category)}>
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCategory(category.id, category.name)}
                                    disabled={category.isDefault}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
          <CardFooter className="text-sm text-gray-500">
            Note: The "Everything" category is the default and cannot be deleted.
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  )
}
