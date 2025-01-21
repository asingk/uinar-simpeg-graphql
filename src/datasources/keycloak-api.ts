import {RESTDataSource} from "@apollo/datasource-rest";
import axios from "axios";
import {RoleModel, UserModel} from "../models/keycloak-api";

export class KeycloakApi extends RESTDataSource {

    override baseURL = process.env.KEYCLOAK_URL + "/"

    async createToken() {
        return axios.post(this.baseURL + 'realms/uinar/protocol/openid-connect/token', {
            grant_type: 'password',
            client_id: 'admin-cli',
            username: process.env.KEYCLOAK_ADMIN_USERNAME,
            password: process.env.KEYCLOAK_ADMIN_PASSWORD,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
    }

    async createUser(username: string, fullname: string, token: string) {
        const name = fullname.split(' ')
        let lastName: string
        if(name.length === 1) {
            lastName = name[0]
        } else if(name.length === 2) {
            lastName = name[1]
        } else {
            name.forEach((row, index) => {
                if (index === 1) {
                    lastName = row
                } else if (index > 1) {
                    lastName += ` ${row}`
                }
            })
        }
        await this.post('admin/realms/uinar/users', {
            body: {
                username,
                firstName: name[0],
                lastName,
                enabled: true,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async getUsers(username: string, token: string) {
        return this.get<UserModel[]>('admin/realms/uinar/users', {
            params: {
                username
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async resetPassword(userId: string, password: string, token: string) {
        await this.put(`admin/realms/uinar/users/${encodeURIComponent(userId)}/reset-password`, {
            body: {
                type: 'password',
                value: password,
                temporary: true,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async getRole(role: string, token: string) {
        return this.get<RoleModel>(`admin/realms/uinar/roles/${encodeURIComponent(role)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async addUserRoles(userId: string, roles: {}[], token: string) {
        await this.post(`admin/realms/uinar/users/${encodeURIComponent(userId)}/role-mappings/realm`, {
            body: roles,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async deleteUser(userId: string, token: string) {
        await this.delete(`admin/realms/uinar/users/${encodeURIComponent(userId)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async deleteUserRoles(userId: string, roles: {}[], token: string) {
        await this.delete(`admin/realms/uinar/users/${encodeURIComponent(userId)}/role-mappings/realm`, {
            body: roles,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

}
