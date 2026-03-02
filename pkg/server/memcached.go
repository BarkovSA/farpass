package server

import (
	"encoding/json"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/BarkovSA/farpass/pkg/farpass"
)

// NewMemcached returns a new memcached database client
func NewMemcached(server string) Database {
	return &Memcached{memcache.New(server)}
}

// Memcached client
type Memcached struct {
	Client *memcache.Client
}

// Status returns whether the secret exists and if it is one-time
func (m *Memcached) Status(key string) (bool, error) {
	r, err := m.Client.Get(key)
	if err == memcache.ErrCacheMiss {
		return false, memcache.ErrCacheMiss
	}
	if err != nil {
		return false, err
	}
	var s farpass.Secret
	if err := json.Unmarshal(r.Value, &s); err != nil {
		return false, err
	}
	return s.OneTime, nil
}

// Get key in memcached
func (m *Memcached) Get(key string) (farpass.Secret, error) {
	var s farpass.Secret

	r, err := m.Client.Get(key)
	if err != nil {
		return s, err
	}

	if err := json.Unmarshal(r.Value, &s); err != nil {
		return s, err
	}

	if s.OneTime {
		if err := m.Client.Delete(key); err != nil {
			return s, err
		}
	}

	return s, nil
}

// Put key in Memcached
func (m *Memcached) Put(key string, secret farpass.Secret) error {
	data, err := secret.ToJSON()
	if err != nil {
		return err
	}

	return m.Client.Set(&memcache.Item{
		Key:        key,
		Value:      data,
		Expiration: secret.Expiration})
}

// Delete key from memcached
func (m *Memcached) Delete(key string) (bool, error) {
	err := m.Client.Delete(key)

	if err == memcache.ErrCacheMiss {
		return false, nil
	}

	return err == nil, err
}
