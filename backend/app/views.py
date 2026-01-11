from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from .models import UserModel
from .serializer import UserModelSerializer

def home(request):
    return HttpResponse("Welcome")

def get_csrf(request):
    return JsonResponse({"csrfToken":get_token(request)})

class UserDetailView(APIView):
    def get_object(self, id):
        try:
            return UserModel.objects.get(id=id)
        except UserModel.DoesNotExist:
            return None
    
    def get(self, request, id):
        user = self.get_object(id)
        if not user:
            return JsonResponse({"error": "user not found"}, status=404)

        serializer = UserModelSerializer(user)
        return JsonResponse(serializer.data, status=200)
    
    def put(self,request, id):
        user = self.get_object(id)
        if not user:
            return JsonResponse("user not found", status = 404)
        
        serializer = UserModelSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)
    
    def delete(self, request, id):
        user = self.get_object(id)
        if not user:
            return JsonResponse("user not found", status = 404)
        user.delete()
        return JsonResponse({"message": f"user '{user.name}' deleted successfully"}, status = 200)
    

class UserListView(APIView):
    def get(self, request):
        users = UserModel.objects.all()
        serializers = UserModelSerializer(users, many=True)
        return JsonResponse(serializers.data, safe=False, status = 200)
    
    def post (self, request):
        serializer = UserModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        
        return JsonResponse(serializer.errors, status = 500)