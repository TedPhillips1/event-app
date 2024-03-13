import React, { startTransition, useEffect } from 'react';
import { ICategory } from '@/lib/database/models/category.model';
import { useState } from 'react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    createCategory,
    getAllCategories,
} from '@/lib/database/actions/category.actions';
import { formatCategory } from '@/lib/utils';

type DropdownProps = {
    onChangeHandler?: () => void;
    currentValue?: string;
};

const Dropdown = ({ onChangeHandler, currentValue }: DropdownProps) => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = () => {
        const categoryName = formatCategory(newCategory);
        createCategory({ categoryName }).then((category: ICategory) => {
            setCategories((prevState) => [...prevState, category]);
        });
    };

    useEffect(() => {
        const getCategories = async () => {
            const categoriesArr = await getAllCategories();
            categoriesArr && setCategories(categoriesArr as ICategory[]);
        };
        getCategories();
    }, []);

    return (
        <Dialog>
            <Select onValueChange={onChangeHandler} defaultValue={currentValue}>
                <SelectTrigger>
                    <SelectValue placeholder='Category' />
                </SelectTrigger>
                <SelectContent>
                    {categories?.map((category) => {
                        return (
                            <SelectItem
                                key={category._id}
                                value={category._id}
                                className='select-item py-3'>
                                {category.name}
                            </SelectItem>
                        );
                    })}
                    <DialogTrigger className='p-medium-14 flex w-full rounded-sm py-3 pl-8 mb-[0.5px] hover:bg-primary-50 text-primary-500 focus:text-primary-500 select-item'>
                        + Add New Category
                    </DialogTrigger>
                </SelectContent>
            </Select>
            <DialogContent className='bg-white'>
                <DialogHeader>
                    <DialogTitle>New Category</DialogTitle>
                    <DialogDescription className='flex flex-col gap-3'>
                        <p>Add a new category to better describe your event.</p>
                        <Input
                            type='text'
                            placeholder='Category Name'
                            onChange={(e) => setNewCategory(e.target.value)}
                            className='placeholder:text-gray-500 text-gray-950'
                        />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button
                            type='submit'
                            onClick={() => startTransition(handleAddCategory)}>
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Dropdown;
