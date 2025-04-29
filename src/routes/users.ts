/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication operations
 *   - name: Users
 *     description: User operations
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Jean Dupont"
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "admin"
 *         password:
 *           type: string
 *           example: "password123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Connection succeded"
 *         data:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: "admin"
 *             token:
 *               type: string
 *               example: "fake-jwt-token"
 *         meta:
 *           $ref: '#/components/schemas/Meta'
 *     UsersResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Users list"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         meta:
 *           $ref: '#/components/schemas/Meta'
 *     Meta:
 *       type: object
 *       properties:
 *         timestamp:
 *           type: string
 *           example: "2025-04-28T20:15:40Z"
 *         path:
 *           type: string
 *           example: "/v1/users"
 *         processingTimeMs:
 *           type: number
 *           example: 32
 * 
 * /api/v1/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "username or password not found"
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *
 * /api/v1/users:
 *   get:
 *     summary: Liste des utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 */

import express, { Request, Response } from 'express';
import { FailureResponse, SuccessResponse } from '../core/ApiResponse';

const router = express.Router();

const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
    { id: 4, name: 'Bob Brown' }
]

router.post('/v1/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        new FailureResponse("username or password not found").send(req, res);
    }
    
    if (username !== "admin" || password !== "password123") {
        new FailureResponse("invalid credentials").send(req, res);
    }
    
    const token = 'fake-jwt-token';
    
    new SuccessResponse("Connection succeded", { username, token }).send(req, res);
});

router.get('/v1/users', (req, res) => {
    new SuccessResponse("Users list", users).send(req, res);
})

export default router;