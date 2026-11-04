import { oc } from "@orpc/contract"
import * as z from "zod"

import { apiErrors, byId, NO_SESSION } from "./shared"

export const AdminLoginRequestSchema = z.object({ email: z.email(), password: z.string() })

export const AdminUserSchema = z.object({
  created_at: z.iso.datetime({ offset: true }).optional(),
  email: z.email().optional(),
  id: z.uuid().optional(),
})
export type AdminUser = z.infer<typeof AdminUserSchema>

export const ListAdminUsersResponseSchema = z.object({ users: z.array(AdminUserSchema).optional() })

export const CreateAdminUserRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const admin = {
  createUser: oc
    .route({
      method: "POST",
      operationId: "createAdminUser",
      path: "/api/admin/users",
      spec: apiErrors({ 409: "Email already registered" }, { admin: true }),
      successStatus: 201,
      summary: "Create a new admin user",
      tags: ["admin"],
    })
    .input(CreateAdminUserRequestSchema)
    .output(AdminUserSchema),
  deleteUser: oc
    .route({
      method: "DELETE",
      operationId: "deleteAdminUser",
      path: "/api/admin/users/{id}",
      spec: apiErrors(
        { 404: "Admin user not found", 409: "Cannot delete your own admin account" },
        { admin: true },
      ),
      successStatus: 204,
      summary: "Delete an admin user",
      tags: ["admin"],
    })
    .input(z.object(byId)),
  listUsers: oc
    .route({
      method: "GET",
      operationId: "listAdminUsers",
      path: "/api/admin/users",
      spec: apiErrors({ 401: NO_SESSION }, { admin: true }),
      summary: "List all admin users",
      tags: ["admin"],
    })
    .output(ListAdminUsersResponseSchema),
  login: oc
    .route({
      method: "POST",
      operationId: "adminLogin",
      path: "/api/admin/login",
      spec: apiErrors({ 401: "Invalid email or password" }),
      summary: "Admin login",
      tags: ["admin"],
    })
    .input(AdminLoginRequestSchema)
    .output(AdminUserSchema),
  logout: oc.route({
    method: "POST",
    operationId: "adminLogout",
    path: "/api/admin/logout",
    successStatus: 204,
    summary: "Admin logout",
    tags: ["admin"],
  }),
  me: oc
    .route({
      method: "GET",
      operationId: "adminMe",
      path: "/api/admin/me",
      spec: apiErrors({ 401: "Not authenticated" }, { admin: true }),
      summary: "Get the current admin user",
      tags: ["admin"],
    })
    .output(AdminUserSchema),
}
