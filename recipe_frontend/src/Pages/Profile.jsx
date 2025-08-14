import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import CardEdit from '../Components/CardEdit';
import CardEditSkeleton from '../Components/CardEditSkeleton';
import { useAuth } from '../Context/AuthContext';
import Modal from '../Modal';
import UpdateRecipeModal from '../Modal/UpdateRecipeModal';
import RecipeModal from '../Modal/RecipeModal';
import RecipeModalComments from '../Modal/RecipeModalComments';
import toast from 'react-hot-toast';

const InitialAvatar = ({ name }) => {
    const initials = name
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("");
    return (
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#F472B6] border-4 font-archivo font-[900] text-4xl">
            {initials}
        </div>
    );
};

const Profile = () => {
    const { user, logout,darkMode } = useAuth();
    const [createdRecipes, setCreatedRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit/Add modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRecipe, setEditRecipe] = useState(null);
    const [isAddMode, setIsAddMode] = useState(false);

    // View modal state
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewRecipe, setViewRecipe] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('https://chapter-7-recipe.onrender.com/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCreatedRecipes(res.data.createdRecipes || []);
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            toast.error("Failed to load profile data ❌");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditRecipe(null);
        setIsAddMode(true);
        setIsEditModalOpen(true);
    };

    const handleEditClick = (recipe) => {
        setEditRecipe(recipe);
        setIsAddMode(false);
        setIsEditModalOpen(true);
    };

    const handleImageClick = async (recipeId) => {
        try {
            const res = await axios.get(`https://chapter-7-recipe.onrender.com/api/recipes/${recipeId}`);
            setViewRecipe(res.data);
            setIsViewModalOpen(true);
        } catch (err) {
            console.error('Failed to fetch recipe details:', err);
            toast.error("Failed to load recipe details ❌");
        }
    };


    const handleDelete = (recipeId) => {
        toast.custom((t) => (
            <div className={`bg-[#f5f5f5] border-2 border-gray-300 rounded-lg p-4 shadow-lg flex flex-col gap-4 w-80 font-inter`}>
                <span className="font-bold text-gray-800 text-lg">
                    Are you sure you want to delete this recipe? ❌
                </span>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 border-2 border-gray-600 rounded-lg hover:bg-gray-200 font-bold"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 border-2 border-black bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                        onClick={async () => {
                            toast.dismiss(t.id); // Close the toast
                            try {
                                const token = localStorage.getItem('token');
                                await axios.delete(`https://chapter-7-recipe.onrender.com/api/recipes/${recipeId}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                setCreatedRecipes(prev => prev.filter(r => r._id !== recipeId));
                                toast.success("Recipe deleted successfully! 🗑️", {
                                    style: {
                                  borderRadius: '10px',
                                        background: 'fffff',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        border: '2px solid black'
                                    }
                                });
                            } catch (err) {
                                console.error("Failed to delete recipe:", err);
                                toast.error("Failed to delete recipe ", {
                                    style: {
                                        borderRadius: '10px',
                                        background: 'fffff',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        border: '2px solid black'
                                    }
                                });
                            }
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    };


    const handleSaveRecipe = async (formData) => {
        try {
            const token = localStorage.getItem('token');

            const payload = {
                ...formData,
                steps: formData.steps.map(s => s.instruction)
            };

            if (isAddMode) {
                await axios.post('https://chapter-7-recipe.onrender.comhttp://localhost:5000/api/recipes', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                toast.success("Recipe added successfully! 🍰", {
                    style: {
                        borderRadius: '10px',
                        background: 'fffff',
                        color: '#000',
                        fontWeight: 'bold',
                        border: '2px solid black'
                    }
                });
            } else {
                await axios.put(
                    `https://chapter-7-recipe.onrender.com/api/recipes/${editRecipe._id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                toast.success("Recipe updated successfully! ✏️");
            }

            await fetchProfile();
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Failed to save recipe:", err);
            toast.error("Something went wrong. Please try again! ❌");
        }
    };

    return (
        <div className='mt-18 h-[calc(100vh-200px)]'>
            {/* Profile Header */}
            <div className='border-2 bg-[#f5f5f5] rounded-lg flex mx-auto mt-36 lg:w-[50%] items-center justify-between px-4 py-4'>
                <div className='flex gap-5'>
                    {user?.username && <InitialAvatar name={user.username} />}
                    <div className='my-4'>
                        <h3 className='font-archivo font-[900] text-3xl'>{user?.username}</h3>
                        <p className='font-inter text-[16px] text-gray-600'>{user?.email}</p>
                    </div>
                </div>
                <div>
                    <button
                        onClick={logout}
                        className='border-2 rounded-lg px-4 py-2 font-inter font-bold hover:bg-black hover:text-white'
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Recipes Section */}
            <div className='h-screen mt-20'>
                <h3  style={{
        color: darkMode ? '#f5f5f5' : '#111827', // text color based on dark mode
  
      }} className='font-archivo  font-[900] text-3xl flex justify-center items-center'>
                    YOUR RECIPES
                    <button
                        onClick={handleAddClick}
                        className='mx-4 border-2 rounded-lg px-4 py-2 text-lg font-inter font-bold bg-black text-white hover:bg-gray-800'
                    >
                        + Add Recipe
                    </button>
                </h3>

                <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 px-18 mt-12'>
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <CardEditSkeleton key={i} />)
                    ) : createdRecipes.length > 0 ? (
                        createdRecipes.map((recipe) => (
                            <CardEdit
                                key={recipe._id}
                                recipe={recipe}
                                onEdit={() => handleEditClick(recipe)}
                                onImageClick={() => handleImageClick(recipe._id)}
                                onDelete={() => handleDelete(recipe._id)}
                            />
                        ))

                    ) : (
                        <p className='text-center col-span-full text-gray-500'>
                            No recipes found
                        </p>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} position="right">
                <UpdateRecipeModal
                    isEditOpen={!isAddMode}
                    editData={editRecipe}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveRecipe}
                />
            </Modal>

            {/* View Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} position="center">
                {viewRecipe && (
                    <RecipeModal
                        data={viewRecipe}
                        recipeId={viewRecipe._id}
                        onClose={() => setIsViewModalOpen(false)}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                            <RecipeModal.Image />
                            <div className="flex flex-col w-full">
                                <RecipeModal.Header />
                                <RecipeModal.Actions />
                                <RecipeModal.Ingredients />
                                <RecipeModal.Steps />
                            </div>
                        </div>
                        <RecipeModal.CommentForm />
                        <Suspense fallback={<div>Loading comments...</div>}>
                            <RecipeModalComments />
                        </Suspense>
                    </RecipeModal>
                )}
            </Modal>
        </div>
    );
};

export default Profile;
