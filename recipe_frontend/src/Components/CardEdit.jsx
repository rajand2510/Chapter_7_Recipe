import { Clock, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

const CardEdit = ({ recipe, onEdit, onImageClick, onDelete }) => {
    return (
        <div className="border-2 bg-[#f5f5f5] rounded-lg h-[400px] overflow-hidden">
            <div 
                className="h-2/3 cursor-pointer" 
                onClick={onImageClick}
            >
                <img
                    className="h-full w-full object-cover"
                    src={recipe?.image}
                    alt="Recipe"
                />
            </div>
            <div className="h-1/3 px-5 pt-3 flex flex-col">
                <div className='flex justify-between '>
                    <h3 className='font-archivo font-extrabold text-2xl truncate'>
                        {recipe?.title}
                    </h3>
                    <div className='flex gap-2 text-gray-600 text-[16px] '>
                        <Clock className='mt-1' size={18} />
                        <span className='font-inter'>{recipe?.cookingTime} m</span>
                    </div>
                </div>
                <div className='flex justify-end my-auto'>
                    <div className="flex gap-2">
                        <div 
                            onClick={onEdit} 
                            className="p-2 border-2 rounded-lg flex items-center justify-center hover:bg-black hover:text-white group"
                        >
                            <Pencil className="w-5 h-5" />
                        </div>
                        <div 
                            onClick={onDelete} 
                            className="p-2 border-2 rounded-lg flex items-center justify-center hover:bg-black hover:text-white group"
                        >
                            <Trash2 className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CardEdit;
