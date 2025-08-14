import { ChevronDown, GripVertical, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const cuisines = ["Indian", "Italian", "Chinese", "Mexican", "French"];

const UpdateRecipeModal = ({ isEditOpen, editData, onClose, onSave }) => {
  const [isCuisineOpen, setIsCuisineOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      image: "",
      cookingTime: "",
      cuisine: "",
      servings: 4, // Fixed serving value
      ingredients: [{ quantity: "", unit: "", name: "" }],
      steps: [{ instruction: "" }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    move: moveIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
    move: moveStep,
  } = useFieldArray({ control, name: "steps" });

  // Pre-fill form if editing
  useEffect(() => {
    if (isEditOpen && editData) {
      reset({
        title: editData.title || "",
        image: editData.image || "",
        cookingTime: editData.cookingTime || "",
        cuisine: editData.cuisine || "",
        servings: 4, // Always keep it fixed
        ingredients:
          editData.ingredients || [{ quantity: "", unit: "", name: "" }],
        steps: editData.steps
          ? editData.steps.map((s) => ({ instruction: s }))
          : [{ instruction: "" }],
      });
    } else {
      reset();
    }
  }, [isEditOpen, editData, reset]);

  const imageUrl = watch("image");
  const selectedCuisine = watch("cuisine");

  const handleSelectCuisine = (cuisine) => {
    setValue("cuisine", cuisine);
    setIsCuisineOpen(false);
  };

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-archivo font-[900] text-4xl">
          {isEditOpen ? "UPDATE RECIPE" : "ADD A NEW RECIPE"}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg font-archivo bg-gray-200 hover:bg-gray-300 font-bold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg font-archivo bg-pink-400 hover:bg-pink-500 font-bold"
            onClick={handleSubmit(onSubmit)}
          >
            {isEditOpen ? "Update" : "Add"}
          </button>
        </div>
      </div>

      <form
        className="flex flex-col overflow-y-scroll h-[90vh] scrollbar-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Title */}
        <label className="font-archivo text-sm font-bold py-2">
          RECIPE TITLE
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          className={`bg-white px-4 py-3 border-2 rounded-lg ${
            errors.title ? "border-red-500" : ""
          }`}
          type="text"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        {/* Image Section */}
        <div className="flex flex-row gap-4 mt-6">
          <div>
            <label className="font-archivo text-sm font-bold pt-2">
              RECIPE IMAGE
            </label>
            {imageUrl ? (
              <img
                className="border-2 mt-2 rounded-lg w-36 h-36 object-cover"
                src={imageUrl}
                alt="Recipe"
              />
            ) : (
              <div className="border-2 mt-2 rounded-lg w-36 h-36 flex items-center justify-center font-archivo font-bold text-xs">
                PREVIEW IMAGE
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <label className="font-archivo text-sm font-bold py-2 mt-14">
              IMAGE URL
            </label>
            <input
              {...register("image", { required: "Image URL is required" })}
              className={`w-full bg-white px-4 py-3 border-2 rounded-lg ${
                errors.image ? "border-red-500" : ""
              }`}
              type="text"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>
        </div>

        {/* Cooking Time - Cuisine - Servings */}
        <div className="flex justify-between gap-8 mt-6">
          <div className="flex flex-col w-1/3">
            <label className="font-archivo text-sm font-bold py-2">
              COOKING TIME (min)
            </label>
            <input
              {...register("cookingTime", {
                required: "Cooking time is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1 minute" },
              })}
              className={`px-4 bg-white py-3 border-2 rounded-lg ${
                errors.cookingTime ? "border-red-500" : ""
              }`}
              type="number"
            />
            {errors.cookingTime && (
              <p className="text-red-500 text-sm">
                {errors.cookingTime.message}
              </p>
            )}
          </div>

          <div className="flex flex-col w-1/3 relative">
            <label className="font-archivo text-sm font-bold py-2">
              CUISINE
            </label>
            <div
              onClick={() => setIsCuisineOpen(!isCuisineOpen)}
              className={`flex justify-between items-center px-4 py-3 border-2 rounded-lg cursor-pointer bg-white ${
                errors.cuisine ? "border-red-500" : ""
              }`}
            >
              <span className="text-gray-700">
                {selectedCuisine || "Select Cuisine"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isCuisineOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {errors.cuisine && (
              <p className="text-red-500 text-sm">{errors.cuisine.message}</p>
            )}
            {isCuisineOpen && (
              <ul className="absolute mt-1 w-full border-2 rounded-lg bg-white shadow-lg z-10">
                {cuisines.map((cuisine) => (
                  <li
                    key={cuisine}
                    onClick={() => handleSelectCuisine(cuisine)}
                    className="px-4 py-2 rounded-lg hover:bg-pink-100 cursor-pointer"
                  >
                    {cuisine}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col w-1/3">
            <label className="font-archivo text-sm font-bold py-2">
              SERVINGS
            </label>
            <input
              {...register("servings")}
              className="px-4 bg-gray-100 py-3 border-2 rounded-lg cursor-not-allowed"
              type="number"
              readOnly
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="flex flex-col gap-4 mt-6">
          <label className="font-archivo text-sm font-bold py-2">
            INGREDIENTS
          </label>
          {ingredientFields.map((field, index) => (
            <div
              key={field.id}
              className="flex w-full items-center gap-2"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", index.toString())
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const fromIndex = Number(e.dataTransfer.getData("text/plain"));
                moveIngredient(fromIndex, index);
              }}
            >
              <GripVertical className="text-gray-400 w-5 h-5 flex-shrink-0 cursor-grab" />
              <input
                placeholder="Qty"
                {...register(`ingredients.${index}.quantity`, {
                  required: "Qty required",
                })}
                className={`w-20 px-4 bg-white py-3 border-2 rounded-lg ${
                  errors.ingredients?.[index]?.quantity ? "border-red-500" : ""
                }`}
              />
              <input
                placeholder="Unit"
                {...register(`ingredients.${index}.unit`, {
                  required: "Unit required",
                })}
                className={`w-28 px-4 bg-white py-3 border-2 rounded-lg ${
                  errors.ingredients?.[index]?.unit ? "border-red-500" : ""
                }`}
              />
              <input
                placeholder="Ingredient Name"
                {...register(`ingredients.${index}.name`, {
                  required: "Name required",
                })}
                className={`flex-grow px-4 bg-white py-3 border-2 rounded-lg ${
                  errors.ingredients?.[index]?.name ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                <X strokeWidth={4} className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendIngredient({ quantity: "", unit: "", name: "" })
            }
            className="py-3 px-4 bg-pink-400 font-archivo font-bold w-44 rounded-lg hover:bg-pink-500"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4 mt-6">
          <label className="font-archivo text-sm font-bold py-2">STEPS</label>
          {stepFields.map((field, index) => (
            <div
              key={field.id}
              className="flex w-full items-center gap-2"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", index.toString())
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const fromIndex = Number(e.dataTransfer.getData("text/plain"));
                moveStep(fromIndex, index);
              }}
            >
              <GripVertical className="text-gray-400 w-5 h-5 flex-shrink-0 cursor-grab" />
              <h3 className="font-archivo font-extrabold text-2xl text-gray-400">
                {index + 1}
              </h3>
              <input
                placeholder="Write Instruction here"
                {...register(`steps.${index}.instruction`, {
                  required: "Step required",
                })}
                className={`flex-grow px-4 bg-white py-3 border-2 rounded-lg ${
                  errors.steps?.[index]?.instruction ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                <X strokeWidth={4} className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendStep({ instruction: "" })}
            className="py-3 px-4 bg-pink-400 font-archivo font-bold w-32 rounded-lg hover:bg-pink-500"
          >
            + Add Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRecipeModal;
