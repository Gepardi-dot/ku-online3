"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { smartListingCreation } from "@/ai/flows/smart-listing-creation";

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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2, Upload } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  category: z.string().nonempty("Please select a category."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  tags: z.string().optional(),
  image: z.any().optional(),
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

export function CreateListingForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      price: 0,
      description: "",
      tags: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("image", reader.result as string);
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
        form.setValue("category", result.suggestedCategory, { shouldValidate: true });
        form.setValue("description", result.suggestedDescription, { shouldValidate: true });
        form.setValue("tags", result.suggestedTags.join(", "), { shouldValidate: true });
        if(result.suggestedPrice) {
            form.setValue("price", result.suggestedPrice, { shouldValidate: true });
        }
        if (!form.getValues('title')) {
            form.setValue('title', `Listing for ${result.suggestedCategory.toLowerCase()}`, { shouldValidate: true });
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
  
  const onSubmit = (data: FormData) => {
    console.log(data);
    toast({
        title: "Listing Created!",
        description: "Your new item is now on the marketplace."
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create a New Listing</CardTitle>
        <CardDescription>Fill out the details below to sell your item.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        <div className="relative w-full aspect-video rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-center p-4 overflow-hidden">
                          {imagePreview ? (
                            <Image src={imagePreview} alt="Product preview" fill style={{objectFit: 'cover'}} />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Upload className="h-8 w-8" />
                                <span>Upload an image</span>
                            </div>
                          )}
                           <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Button type="button" onClick={handleAIAssist} disabled={isGenerating || !imagePreview} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Handwoven Kurdish Rug" {...field} />
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
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (IQD)</FormLabel>
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

              </div>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item in detail..."
                      className="resize-none"
                      rows={5}
                      {...field}
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
                    <Input placeholder="e.g. handmade, traditional, wool" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" size="lg">Create Listing</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
