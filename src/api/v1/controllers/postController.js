const Post = require('../models/Post');
const User = require('../models/User');

// Controller to create a new post
exports.createPost = async (req, res) => {
    try {
        const { companyName, email, phone, phoneCountry, keywords, description, image, postType } = req.body;

        // Validate required fields
        if (!companyName || !email || !phone || !phoneCountry || !keywords || !description || !image || !postType) {
            return res.status(400).send({ error: 'All fields are required.' });
        }

        // Create new post
        const newPost = new Post({
            companyName,
            email,
            phone,
            phoneCountry,
            keywords,
            description,
            image,
            postType,
            createdBy: req.user.userId
        });


        await newPost.save();

        res.status(201).send({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send({ error: 'Post creation failed' });
    }
};
exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const keyword = req.query.keyword || '';
        const postType = req.query.postType;
        const phoneCountry = req.query.country;

        // Check if postType is provided and valid
        if (!postType) {
            return res.status(400).send({ error: 'postType parameter is required' });
        }

        // Validate postType (assume valid types are 'orderGiver' and 'devTeam')
        if (!['orderGiver', 'devTeam'].includes(postType)) {
            return res.status(400).send({ error: 'Invalid postType parameter' });
        }

        // Validate phoneCountry if provided
        if (phoneCountry && phoneCountry !== 'all' && !['FR', 'MA'].includes(phoneCountry)) {
            return res.status(400).send({ error: 'Invalid phoneCountry parameter' });
        }

        // Construct the query
        const query = {
            postType, // Filter by postType
            ...(keyword && { keywords: { $regex: keyword, $options: 'i' } }), // Add keyword search if provided
            ...(phoneCountry && phoneCountry !== 'all' && { phoneCountry }) // Filter by phoneCountry if provided and not 'all'
        };

        // Fetch posts
        const posts = await Post.find(query)
            .populate('createdBy', 'companyName email')
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments(query);

        res.status(200).send({
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send({ error: 'Failed to fetch posts' });
    }
};



exports.getUserType = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        res.status(200).send({ postType: user.userType });
    } catch (error) {
        console.error('Error fetching user type:', error);
        res.status(500).send({ error: 'Failed to fetch user type' });
    }
};