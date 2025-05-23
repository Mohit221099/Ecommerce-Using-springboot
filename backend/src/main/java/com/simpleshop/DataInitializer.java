package com.simpleshop;

import com.simpleshop.model.Product;
import com.simpleshop.model.User;
import com.simpleshop.repository.ProductRepository;
import com.simpleshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize test users if repository is empty
        if (userRepository.count() == 0) {
            initializeUsers();
        }

        // Initialize test products if repository is empty
        if (productRepository.count() == 0) {
            initializeProducts();
        }
    }

    private void initializeUsers() {
        // Create admin user
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword(passwordEncoder.encode("admin"));
        Set<String> adminRoles = new HashSet<>();
        adminRoles.add("ADMIN");
        adminRoles.add("USER");
        adminUser.setRoles(adminRoles);
        userRepository.save(adminUser);

        // Create regular user
        User regularUser = new User();
        regularUser.setUsername("user");
        regularUser.setEmail("user@example.com");
        regularUser.setPassword(passwordEncoder.encode("user"));
        Set<String> userRoles = new HashSet<>();
        userRoles.add("USER");
        regularUser.setRoles(userRoles);
        userRepository.save(regularUser);
    }

    private void initializeProducts() {
        // Electronics
        Product headphones = new Product();
        headphones.setName("Wireless Headphones");
        headphones.setDescription("High-quality wireless headphones with noise cancellation and long battery life.");
        headphones.setPrice(new BigDecimal("99.99"));
        headphones.setImageUrl("https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=800");
        headphones.setCategory("Electronics");
        headphones.setStock(15);
        productRepository.save(headphones);

        Product smartphone = new Product();
        smartphone.setName("Smartphone");
        smartphone.setDescription("Latest model smartphone with high-resolution camera and fast processor.");
        smartphone.setPrice(new BigDecimal("799.99"));
        smartphone.setImageUrl("https://images.pexels.com/photos/1447254/pexels-photo-1447254.jpeg?auto=compress&cs=tinysrgb&w=800");
        smartphone.setCategory("Electronics");
        smartphone.setStock(8);
        productRepository.save(smartphone);

        Product camera = new Product();
        camera.setName("Digital Camera");
        camera.setDescription("Professional digital camera with 4K video recording.");
        camera.setPrice(new BigDecimal("649.99"));
        camera.setImageUrl("https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800");
        camera.setCategory("Electronics");
        camera.setStock(5);
        productRepository.save(camera);

        // Clothing
        Product tshirt = new Product();
        tshirt.setName("Casual T-Shirt");
        tshirt.setDescription("100% cotton casual t-shirt, perfect for everyday wear.");
        tshirt.setPrice(new BigDecimal("24.99"));
        tshirt.setImageUrl("https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800");
        tshirt.setCategory("Clothing");
        tshirt.setStock(50);
        productRepository.save(tshirt);

        Product jacket = new Product();
        jacket.setName("Winter Jacket");
        jacket.setDescription("Warm winter jacket with water-resistant outer shell.");
        jacket.setPrice(new BigDecimal("149.99"));
        jacket.setImageUrl("https://images.pexels.com/photos/8364025/pexels-photo-8364025.jpeg?auto=compress&cs=tinysrgb&w=800");
        jacket.setCategory("Clothing");
        jacket.setStock(20);
        productRepository.save(jacket);

        Product shoes = new Product();
        shoes.setName("Running Shoes");
        shoes.setDescription("Lightweight running shoes with cushioned soles.");
        shoes.setPrice(new BigDecimal("89.95"));
        shoes.setImageUrl("https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800");
        shoes.setCategory("Clothing");
        shoes.setStock(25);
        productRepository.save(shoes);

        // Books
        Product novel = new Product();
        novel.setName("Novel - The Great Journey");
        novel.setDescription("A bestselling novel about adventure and discovery.");
        novel.setPrice(new BigDecimal("18.95"));
        novel.setImageUrl("https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=800");
        novel.setCategory("Books");
        novel.setStock(30);
        productRepository.save(novel);

        Product cookbook = new Product();
        cookbook.setName("Cooking Basics Cookbook");
        cookbook.setDescription("Learn all the basics of cooking with this illustrated cookbook.");
        cookbook.setPrice(new BigDecimal("34.95"));
        cookbook.setImageUrl("https://images.pexels.com/photos/4144234/pexels-photo-4144234.jpeg?auto=compress&cs=tinysrgb&w=800");
        cookbook.setCategory("Books");
        cookbook.setStock(15);
        productRepository.save(cookbook);

        Product sciFiCollection = new Product();
        sciFiCollection.setName("Science Fiction Collection");
        sciFiCollection.setDescription("A collection of classic science fiction novels.");
        sciFiCollection.setPrice(new BigDecimal("49.99"));
        sciFiCollection.setImageUrl("https://images.pexels.com/photos/2927080/pexels-photo-2927080.jpeg?auto=compress&cs=tinysrgb&w=800");
        sciFiCollection.setCategory("Books");
        sciFiCollection.setStock(10);
        productRepository.save(sciFiCollection);

        // Home & Kitchen
        Product coffeeMaker = new Product();
        coffeeMaker.setName("Coffee Maker");
        coffeeMaker.setDescription("Programmable coffee maker with thermal carafe.");
        coffeeMaker.setPrice(new BigDecimal("79.95"));
        coffeeMaker.setImageUrl("https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg?auto=compress&cs=tinysrgb&w=800");
        coffeeMaker.setCategory("Home & Kitchen");
        coffeeMaker.setStock(10);
        productRepository.save(coffeeMaker);

        Product blender = new Product();
        blender.setName("Blender");
        blender.setDescription("Powerful blender for smoothies and food processing.");
        blender.setPrice(new BigDecimal("69.99"));
        blender.setImageUrl("https://images.pexels.com/photos/1714422/pexels-photo-1714422.jpeg?auto=compress&cs=tinysrgb&w=800");
        blender.setCategory("Home & Kitchen");
        blender.setStock(12);
        productRepository.save(blender);

        Product standMixer = new Product();
        standMixer.setName("Stand Mixer");
        standMixer.setDescription("Professional stand mixer for baking enthusiasts.");
        standMixer.setPrice(new BigDecimal("299.99"));
        standMixer.setImageUrl("https://images.pexels.com/photos/4194623/pexels-photo-4194623.jpeg?auto=compress&cs=tinysrgb&w=800");
        standMixer.setCategory("Home & Kitchen");
        standMixer.setStock(7);
        productRepository.save(standMixer);
    }
}