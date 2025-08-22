# In your Django views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from django.http import HttpResponse

# You may also want to use Pillow for image processing
from PIL import Image

@csrf_exempt
def answer(request):
    if request.method == 'POST':
        # Check if the 'drawing' file is in the request
        print(1)
        if 'drawing' in request.FILES:
            uploaded_file = request.FILES['drawing']
            print(2)
            # This is where the image data is. It's a file-like object.
            # You can process it directly or save it.

            # Example: Process with Pillow without saving to disk first
            try:
                image = Image.open(uploaded_file)
                # You can now use the 'image' object for your processing
                # For example, get dimensions
                print(f"Direct image received. Dimensions: {image.width}x{image.height}")
                print(3)
                # Perform your custom "reocessing" here...
                # e.g., image.save('path/to/save/processed_image.png')
                
                return JsonResponse({
                    'status': 'success',
                    'message': 'Image processed successfully',
                    'width': image.width,
                    'height': image.height
                })

            except Exception as e:
                # Handle potential errors during image processing
                return JsonResponse({
                    'status': 'error', 
                    'message': f'Image processing failed: {str(e)}'
                }, status=500)
                
        else:
            return JsonResponse({'status': 'error', 'message': 'No image file found'}, status=400)
            
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


def home(request):
    return HttpResponse("Hello")