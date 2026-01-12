from django.http import HttpResponse
from rest_framework.response import Response
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from .models import UserModel
from .serializer import UserModelSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

def home(request):
    return HttpResponse("Welcome")

def get_csrf(request):
    return Response({"csrfToken":get_token(request)})

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, id):
        try:
            return UserModel.objects.get(id=id)
        except UserModel.DoesNotExist:
            return None
    
    def get(self, request, id):
        user = self.get_object(id)
        if not user:
            return Response({"error": "user not found"}, status=404)

        serializer = UserModelSerializer(user)
        return Response(serializer.data, status=200)
    
    def put(self,request, id):
        user = self.get_object(id)
        if not user:
            return Response("user not found", status = 404)
        
        serializer = UserModelSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, id):
        user = self.get_object(id)
        if not user:
            return Response("user not found", status = 404)
        user.delete()
        return Response({"message": f"user '{user.name}' deleted successfully"}, status = 200)
    

class UserListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users = UserModel.objects.all()
        paginator = PageNumberPagination()
        paginator.page_size = 5
        result_page = paginator.paginate_queryset(users, request)
        serializer = UserModelSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
    
    def post (self, request):
        serializer = UserModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status = 500)