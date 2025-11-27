import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Design {
  id: string;
  name: string;
  clothingType: 'shirt' | 'dress' | 'pants' | 'jacket' | 'skirt';
  color: string;
  fabric: string;
  pattern: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
  likes: number;
  imageUrl?: string;
}

interface DesignState {
  designs: Design[];
  currentDesign: Design | null;
  publicDesigns: Design[];
  isLoading: boolean;
}

type DesignAction =
  | { type: 'SET_DESIGNS'; payload: Design[] }
  | { type: 'ADD_DESIGN'; payload: Design }
  | { type: 'UPDATE_DESIGN'; payload: Design }
  | { type: 'DELETE_DESIGN'; payload: string }
  | { type: 'SET_CURRENT_DESIGN'; payload: Design | null }
  | { type: 'SET_PUBLIC_DESIGNS'; payload: Design[] }
  | { type: 'LIKE_DESIGN'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: DesignState = {
  designs: [],
  currentDesign: null,
  publicDesigns: [],
  isLoading: false,
};

const designReducer = (state: DesignState, action: DesignAction): DesignState => {
  switch (action.type) {
    case 'SET_DESIGNS':
      return { ...state, designs: action.payload };
    case 'ADD_DESIGN':
      return { ...state, designs: [...state.designs, action.payload] };
    case 'UPDATE_DESIGN':
      return {
        ...state,
        designs: state.designs.map(d => d.id === action.payload.id ? action.payload : d)
      };
    case 'DELETE_DESIGN':
      return {
        ...state,
        designs: state.designs.filter(d => d.id !== action.payload)
      };
    case 'SET_CURRENT_DESIGN':
      return { ...state, currentDesign: action.payload };
    case 'SET_PUBLIC_DESIGNS':
      return { ...state, publicDesigns: action.payload };
    case 'LIKE_DESIGN':
      return {
        ...state,
        publicDesigns: state.publicDesigns.map(d => 
          d.id === action.payload ? { ...d, likes: d.likes + 1 } : d
        )
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const DesignContext = createContext<{
  state: DesignState;
  createDesign: (design: Omit<Design, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) => void;
  updateDesign: (design: Design) => void;
  deleteDesign: (id: string) => void;
  setCurrentDesign: (design: Design | null) => void;
  likeDesign: (id: string) => void;
  loadPublicDesigns: () => void;
} | undefined>(undefined);

export const DesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(designReducer, initialState);

  const createDesign = (designData: Omit<Design, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) => {
    const newDesign: Design = {
      ...designData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
    };
    dispatch({ type: 'ADD_DESIGN', payload: newDesign });
  };

  const updateDesign = (design: Design) => {
    const updatedDesign = { ...design, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_DESIGN', payload: updatedDesign });
  };

  const deleteDesign = (id: string) => {
    dispatch({ type: 'DELETE_DESIGN', payload: id });
  };

  const setCurrentDesign = (design: Design | null) => {
    dispatch({ type: 'SET_CURRENT_DESIGN', payload: design });
  };

  const likeDesign = (id: string) => {
    dispatch({ type: 'LIKE_DESIGN', payload: id });
  };

  const loadPublicDesigns = () => {
    // Mock public designs data
    const mockPublicDesigns: Design[] = [
      {
        id: 'pub1',
        name: 'Summer Floral Dress',
        clothingType: 'dress',
        color: '#FF69B4',
        fabric: 'Cotton',
        pattern: 'Floral',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user2',
        isPublic: true,
        likes: 24,
        imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=300&h=400&fit=crop'
      },
      {
        id: 'pub2',
        name: 'Classic Denim Jacket',
        clothingType: 'jacket',
        color: '#4169E1',
        fabric: 'Denim',
        pattern: 'Solid',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user3',
        isPublic: true,
        likes: 18,
        imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=300&h=400&fit=crop'
      },
    ];
    dispatch({ type: 'SET_PUBLIC_DESIGNS', payload: mockPublicDesigns });
  };

  return (
    <DesignContext.Provider value={{
      state,
      createDesign,
      updateDesign,
      deleteDesign,
      setCurrentDesign,
      likeDesign,
      loadPublicDesigns,
    }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};