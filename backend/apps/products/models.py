from django.db import models
from django.utils.text import slugify


class ProductType(models.Model):
    """
    Loại sản phẩm: Camera, Lens, Film, Instax, Phụ kiện...
    Dùng để lọc nhanh theo loại.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name = "Loại sản phẩm"
        verbose_name_plural = "Loại sản phẩm"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Series(models.Model):
    """
    Dòng sản phẩm: GFX Series, X Series, Instax, Film, Phụ kiện...
    Một Series thuộc về một ProductType.
    Ví dụ: GFX Series → Camera | X Series → Camera | Instax Mini → Instax
    """
    product_type = models.ForeignKey(
        ProductType, on_delete=models.CASCADE, related_name="series"
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Dòng sản phẩm"
        verbose_name_plural = "Dòng sản phẩm"
        ordering = ["product_type", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_type} › {self.name}"


class Category(models.Model):
    """
    Danh mục chi tiết bên trong một Series.
    Ví dụ: X Series → X-T (Mirrorless), X-S (Entry-level)...
    Có thể bỏ qua nếu không cần phân cấp sâu.
    """
    series = models.ForeignKey(
        Series, on_delete=models.SET_NULL, null=True, blank=True, related_name="categories"
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name = "Danh mục"
        verbose_name_plural = "Danh mục"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    product_type = models.ForeignKey(
        ProductType, on_delete=models.SET_NULL, null=True, related_name="products",
        help_text="Loại: Camera, Lens, Film, Instax, Phụ kiện..."
    )
    series = models.ForeignKey(
        Series, on_delete=models.SET_NULL, null=True, blank=True, related_name="products",
        help_text="Dòng: GFX Series, X Series, Instax..."
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="products",
        help_text="Danh mục chi tiết (tuỳ chọn)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Sản phẩm"
        verbose_name_plural = "Sản phẩm"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class ProductAttribute(models.Model):
    """
    Thông số kỹ thuật dạng key-value linh hoạt.
    Ví dụ camera:
        group="Cảm biến", name="Độ phân giải", value="40.2 MP"
    Ví dụ laptop:
        group="CPU",      name="Model",        value="Intel Core i7-13700H"
    """
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="attributes"
    )
    group = models.CharField(
        max_length=100, blank=True, default="",
        help_text="Nhóm thông số, ví dụ: Cảm biến, CPU, Màn hình..."
    )
    name = models.CharField(max_length=150, help_text="Tên thông số")
    value = models.CharField(max_length=500, help_text="Giá trị")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name = "Thông số kỹ thuật"
        verbose_name_plural = "Thông số kỹ thuật"
        ordering = ["group", "order", "name"]

    def __str__(self):
        prefix = f"{self.group} – " if self.group else ""
        return f"{self.product} | {prefix}{self.name}: {self.value}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image_url = models.ImageField(upload_to="products/images/")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name = "Ảnh sản phẩm"
        verbose_name_plural = "Ảnh sản phẩm"
        ordering = ["order"]

    def __str__(self):
        return f"Image #{self.order} – {self.product}"


class ProductColor(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="colors")
    name = models.CharField(max_length=50)
    hex_code = models.CharField(max_length=7, help_text="#RRGGBB")

    class Meta:
        verbose_name = "Màu sắc"
        verbose_name_plural = "Màu sắc"

    def __str__(self):
        return f"{self.name} ({self.hex_code})"


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=14, decimal_places=0)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Biến thể"
        verbose_name_plural = "Biến thể"

    def __str__(self):
        return f"{self.product} – {self.name}"
