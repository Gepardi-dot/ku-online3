
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { smartListingCreation } from "@/ai/flows/smart-listing-creation";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2, Upload, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  category: z.string().nonempty("Please select a category."),
  condition: z.enum(["New", "Used - Like New", "Used - Good", "Used - Fair"]),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  location: z.string().nonempty("Please select a city."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  tags: z.string().optional(),
  image: z.any().refine(val => val, { message: "Product image is required." }),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  "Electronics",
  "Home & Garden",
  "Fashion",
  "Health & Beauty",
  "Sports & Outdoors",
  "Toys & Games",
  "Books & Media",
  "Other",
];

const cities = [
    "Erbil",
    "Sulaymaniyah",
    "Duhok",
    "Zaxo"
]

export function CreateListingForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      price: 0,
      description: "",
      tags: "",
      location: "",
      condition: "New",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("image", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAssist = async () => {
    const imageDataUri = form.getValues("image");
    if (!imageDataUri) {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please upload an image first to use the AI assistant.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await smartListingCreation({
        photoDataUri: imageDataUri,
        title: form.getValues("title"),
        category: form.getValues("category"),
      });

      if (result) {
        if(result.suggestedCategory && !form.getValues('category')) {
          const matchingCategory = categories.find(c => c.toLowerCase() === result.suggestedCategory.toLowerCase()) || "Other";
          form.setValue("category", matchingCategory, { shouldValidate: true });
        }

        if(result.suggestedDescription && !form.getValues('description')) {
          form.setValue("description", result.suggestedDescription, { shouldValidate: true });
        }
       
        if(result.suggestedTags && result.suggestedTags.length > 0 && !form.getValues('tags')) {
           form.setValue("tags", result.suggestedTags.join(", "), { shouldValidate: true });
        }

        if(result.suggestedPrice && form.getValues('price') === 0) {
            form.setValue("price", result.suggestedPrice, { shouldValidate: true });
        }

        if (!form.getValues('title') && result.suggestedCategory) {
            form.setValue('title', `A ${result.suggestedCategory.toLowerCase()} item`, { shouldValidate: true });
        }

        toast({
          title: "AI Assistant Complete",
          description: "We've filled in some details for you.",
        });
      }
    } catch (error) {
      console.error("AI generation failed:", error);
      toast({
        variant: "destructive",
        title: "AI Assistant Failed",
        description: "Could not generate suggestions. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if(!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be signed in to create a listing."
        });
        return;
    }

    setIsSubmitting(true);
    try {
        // 1. Upload image to Firebase Storage
        const storageRef = ref(storage, `products/${Date.now()}-${Math.random().toString(36).substring(7)}`);
        const uploadResult = await uploadString(storageRef, data.image, 'data_url');
        const imageUrl = await getDownloadURL(uploadResult.ref);

        // 2. Add product data to Firestore
        const docRef = await addDoc(collection(db, "products"), {
            name: data.title,
            category: data.category,
            price: data.price,
            description: data.description,
            tags: data.tags?.split(',').map(tag => tag.trim()).filter(tag => tag),
            condition: data.condition,
            location: data.location,
            currency: 'IQD',
            imageUrl,
            imageHint: '',
            seller: {
                name: user.displayName,
                avatarUrl: user.photoURL,
                rating: 0, // Initial rating
            },
            sellerId: user.uid,
            createdAt: serverTimestamp(),
        });
        
        toast({
            title: "Listing Created!",
            description: "Your new item is now live on the marketplace."
        });
        
        router.push(`/products/${docRef.id}`);

    } catch (error) {
        console.error("Error creating listing:", error);
        toast({
            variant: "destructive",
            title: "Listing Creation Failed",
            description: "Something went wrong. Please try again."
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create a New Listing</CardTitle>
        <CardDescription>Fill out the details below to sell your item. The more details you provide, the better!</CardDescription>
      </CardHeader>
      <CardContent>
        {!user && (
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>You are not signed in</AlertTitle>
                <AlertDescription>
                   Please sign in to create a listing.
                </AlertDescription>
            </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image *</FormLabel>
                      <FormControl>
                        <div className="relative w-full aspect-video rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-center p-4 overflow-hidden">
                          {imagePreview ? (
                            <Image src={imagePreview} alt="Product preview" fill style={{objectFit: 'cover'}} />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Upload className="h-8 w-8" />
                                <span>Upload an image</span>
                                <p className="text-xs">Required</p>
                            </div>
                          )}
                           <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                            disabled={!user || isSubmitting}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Button type="button" onClick={handleAIAssist} disabled={isGenerating || !imagePreview || !user || isSubmitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? 'Analyzing Image...' : 'Auto-fill with AI'}
                </Button>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Handwoven Kurdish Rug" {...field} disabled={!user || isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!user || isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price (IQD) *</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input type="number" placeholder="e.g. 150000" {...field} className="pl-8"/>
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">د.ع</span>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!user || isSubmitting}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Used - Like New">Used - Like New</SelectItem>
                              <SelectItem value="Used - Good">Used - Good</SelectItem>
                              <SelectItem value="Used - Fair">Used - Fair</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!user || isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item in detail..."
                      className="resize-none"
                      rows={5}
                      {...field}
                      disabled={!user || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. handmade, traditional, wool" {...field} disabled={!user || isSubmitting}/>
                  </FormControl>
                  <FormDescription>
                    Separate tags with a comma. These help buyers find your item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={!user || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating Listing..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
