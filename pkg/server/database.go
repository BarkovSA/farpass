package server

import "github.com/BarkovSA/farpass/pkg/farpass"

// Database interface
type Database interface {
	Get(key string) (farpass.Secret, error)
	Put(key string, secret farpass.Secret) error
	Delete(key string) (bool, error)
	Status(key string) (oneTime bool, err error)
}
